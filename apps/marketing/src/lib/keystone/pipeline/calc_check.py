"""Deterministic recomputation of the calculation expressions a model returns with a worked solution.

stdin : JSON array of {"expr": str, "expect": str, "rounding": str}
stdout: JSON array of {"ok": bool, "value": str, "raw": str, "error": str}, same length and order.

The expressions are untrusted. They are checked against a strict character and name whitelist
before they reach sympy's parser, which then only sees the names in ALLOWED. Nothing here
calls eval/exec/compile/sympify on the raw text.
"""
import json
import re
import signal
import sys
import time
import warnings
from decimal import Decimal, ROUND_HALF_UP, getcontext, localcontext

warnings.simplefilter("ignore")
START = time.monotonic()

MAX_LEN = 500
MAX_ARG = 10000
SECONDS = 5
DEADLINE = 8
MAX_ENTRIES = 200


class Reject(Exception):
    pass


def fail(reason):
    return {"ok": False, "value": "", "raw": "", "error": reason}


def load_sympy():
    """`python3 -I` ignores the per-user site directory, where pip --user puts sympy. Fall back to that
    one directory (appended last, so it can never shadow the standard library)."""
    try:
        import sympy
        return sympy
    except ImportError:
        import site
        path = site.getusersitepackages()
        if path not in sys.path:
            sys.path.append(path)
        import sympy
        return sympy


def build_allowed():
    sp = load_sympy()

    def deg_in(f):
        return lambda x: f(x * sp.pi / 180)

    def deg_out(f):
        return lambda x: f(x) * 180 / sp.pi

    return {
        "sqrt": sp.sqrt, "sin": sp.sin, "cos": sp.cos, "tan": sp.tan,
        "asin": sp.asin, "acos": sp.acos, "atan": sp.atan,
        "log": sp.log, "ln": sp.log, "log10": lambda x: sp.log(x, 10), "exp": sp.exp,
        "pi": sp.pi, "E": sp.E, "Rational": sp.Rational,
        "binomial": sp.binomial, "factorial": sp.factorial, "Abs": sp.Abs,
        "sind": deg_in(sp.sin), "cosd": deg_in(sp.cos), "tand": deg_in(sp.tan),
        "asind": deg_out(sp.asin), "acosd": deg_out(sp.acos), "atand": deg_out(sp.atan),
    }


NAMES = {"sqrt", "sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "log10", "exp", "pi", "E",
         "Rational", "binomial", "factorial", "Abs", "sind", "cosd", "tand", "asind", "acosd", "atand"}
CHARS = re.compile(r"^[0-9A-Za-z_. +\-*/^(),]*$")  # a plain space only: no tab, form feed or other control characters
TOKEN = re.compile(r"\d+\.?\d*|\.\d+|[A-Za-z_][A-Za-z0-9_]*|\S")
RANGE = Decimal("1e300")


def validate(text):
    if not isinstance(text, str) or not text.strip():
        raise Reject("empty expression")
    if len(text) > MAX_LEN:
        raise Reject("expression too long")
    if "__" in text or "//" in text or not CHARS.match(text):
        raise Reject("character not allowed")
    # 1E+5, 1e5, 2 E 3, E5, E.5: Python would read one float literal. The constant E stays usable as E, E^2, 2*E.
    if re.search(r"[\d.]\s*[Ee]", text) or re.search(r"[Ee][\d.]", text):
        raise Reject("exponent notation is not allowed; write a*10^n")
    for tok in TOKEN.findall(text):
        if re.match(r"[A-Za-z_]", tok) and tok not in NAMES:
            raise Reject("name not allowed: " + tok[:20])
    for m in re.finditer(r"\.", text):
        i = m.start()
        before = text[i - 1] if i > 0 else ""
        after = text[i + 1] if i + 1 < len(text) else ""
        if before.isalpha() or before == "_" or not (before.isdigit() or after.isdigit()):
            raise Reject("misplaced decimal point")
    if len(re.findall(r"Rational", text)) != len(re.findall(r"Rational\s*\(\s*\d+\s*(?:,\s*\d+\s*)?\)", text)):
        raise Reject("Rational takes one or two whole numbers")
    # resource guard (literals only; the alarm covers the rest)
    for m in re.finditer(r"(?:\*\*|\^)\s*\(*\s*[+-]?\s*(\d+)\s*(\*\*|\^)?", text):
        if int(m.group(1)) > MAX_ARG or m.group(2):
            raise Reject("exponent too large")
    for m in re.finditer(r"(?:factorial|binomial)\s*\(\s*(\d+)(?:\s*,\s*(\d+))?", text):
        if any(g and int(g) > MAX_ARG for g in m.groups()):
            raise Reject("argument too large")


def decimals_exact(text):
    """Decimal literals become exact rationals, so 0.30 is 3/10 and not a binary float."""
    def sub(m):
        whole, frac = m.group(1), m.group(2)
        return "Rational(%d,%d)" % (int((whole or "0") + frac), 10 ** len(frac))
    return re.sub(r"(\d*)\.(\d*)", lambda m: sub(m) if (m.group(1) or m.group(2)) else m.group(0), text)


def evaluate(text, allowed):
    import sympy as sp
    from sympy.parsing.sympy_parser import parse_expr, standard_transformations

    validate(text)
    src = decimals_exact(text.replace("^", "**"))
    glob = {"__builtins__": {}, "Integer": sp.Integer, "Float": sp.Float, "Rational": sp.Rational, "Symbol": sp.Symbol}
    expr = parse_expr(src, local_dict=dict(allowed), global_dict=glob,
                      transformations=standard_transformations, evaluate=True)
    if not isinstance(expr, sp.Basic) or not getattr(expr, "is_number", False):
        if getattr(expr, "free_symbols", None):
            raise Reject("unknown name")
        raise Reject("not a number")
    val = expr.evalf(30)
    if val.has(sp.zoo, sp.nan, sp.oo, -sp.oo) or val.is_real is not True or not val.is_finite:
        raise Reject("not a finite real number")
    return Decimal(str(val))


def int_digits(d):
    return max(d.adjusted() + 1, 1)


def plain(d):
    """Plain decimal string for any magnitude: never exponent form."""
    if d == 0:
        return "0"
    return format(d, "f")


def to_sf(d, n):
    if d == 0:
        return Decimal(0)
    return d.quantize(Decimal(1).scaleb(d.adjusted() - n + 1), rounding=ROUND_HALF_UP)


def strip_zeros(s):
    return s.rstrip("0").rstrip(".") if "." in s else s


def apply_rounding(d, rounding):
    if d != 0 and (abs(d) > RANGE or abs(d) < 1 / RANGE):
        raise Reject("out of range")
    rounding = (rounding or "").strip().lower()
    m = re.match(r"^(\d{1,2})\s*(dp|sf)$", rounding)
    if rounding and (not m or int(m.group(1)) > 30 or (m.group(2) == "sf" and int(m.group(1)) < 1)):
        raise Reject("rounding not understood")
    n = int(m.group(1)) if m else 15
    with localcontext() as ctx:
        ctx.prec = int_digits(d) + n + 10 + (300 if d != 0 and abs(d) < 1 else 0)
        if not rounding:
            return strip_zeros(plain(to_sf(d, 15)))
        if m.group(2) == "dp":
            q = d.quantize(Decimal(1).scaleb(-n), rounding=ROUND_HALF_UP)
            return format(abs(q) if q == 0 else q, "f")
        return plain(to_sf(d, n))


class Timeout(BaseException):  # not an Exception: a broad `except Exception` inside sympy must not swallow it
    pass


def on_alarm(signum, frame):
    raise Timeout()


def run_one(entry, allowed):
    try:
        if not isinstance(entry, dict):
            return fail("entry is not an object")
        d = evaluate(entry.get("expr"), allowed)
        rounding = entry.get("rounding") or ""
        return {"ok": True, "value": apply_rounding(d, rounding), "raw": apply_rounding(d, ""), "error": ""}
    except Timeout:
        return fail("took too long")
    except Reject as e:
        return fail(str(e))
    except ArithmeticError:
        return fail("out of range")
    except RecursionError:
        return fail("expression too deep")
    except MemoryError:
        return fail("out of memory")
    except Exception as e:  # SyntaxError, TypeError, sympy errors, ...
        return fail("could not parse (" + type(e).__name__ + ")")


def main():
    getcontext().prec = 80
    try:
        entries = json.loads(sys.stdin.read())
        if not isinstance(entries, list):
            raise ValueError
    except Exception:
        print("[]")
        return
    try:
        allowed = build_allowed()
    except Exception:
        print(json.dumps([fail("sympy is not available") for _ in entries]))
        return
    have_alarm = hasattr(signal, "setitimer")
    if have_alarm:
        signal.signal(signal.SIGALRM, on_alarm)
    out = []
    for i, entry in enumerate(entries):
        if i >= MAX_ENTRIES:
            out.append(fail("too many expressions"))
            continue
        left = DEADLINE - (time.monotonic() - START)
        if left <= 0:
            out.append(fail("took too long"))
            continue
        if have_alarm:
            signal.setitimer(signal.ITIMER_REAL, min(SECONDS, left))
        try:
            out.append(run_one(entry, allowed))
        except Timeout:
            out.append(fail("took too long"))
        except BaseException:
            out.append(fail("check failed"))
        finally:
            if have_alarm:
                signal.setitimer(signal.ITIMER_REAL, 0)
    print(json.dumps(out))


if __name__ == "__main__":
    main()
