#!/usr/bin/env python3
"""Convert cPanel UAPI DNS::parse_zone JSON into a BIND zone file for Cloudflare import.

Usage: cpanel-zone-to-bind.py <parse_zone.json> <zone-name> > out.zone
Drops SOA and apex NS (Cloudflare manages both). Everything else is kept verbatim.
"""
import base64, json, sys

src, zone = sys.argv[1], sys.argv[2].rstrip('.')
doc = json.load(open(src))
items = doc.get('result', doc).get('data', doc.get('data'))
if items is None:
    sys.exit(f"unexpected JSON shape: top keys {list(doc)[:10]}")

def b64(s):
    return base64.b64decode(s).decode('utf-8', 'replace')

def fqdn(name):
    if name in ('', '@'):
        return zone + '.'
    if name.endswith('.'):
        return name
    return f"{name}.{zone}."

out, dropped, counts = [], [], {}
out.append(f"$ORIGIN {zone}.\n$TTL 14400\n")
for it in items:
    if it.get('type') != 'record':
        continue
    rtype = it['record_type']
    name = fqdn(b64(it['dname_b64']))
    ttl = it.get('ttl') or 14400
    fields = [b64(x) for x in it.get('data_b64', [])]
    if rtype == 'SOA' or (rtype == 'NS' and name == zone + '.'):
        dropped.append((name, rtype, fields)); continue
    if rtype == 'TXT':
        rdata = ' '.join('"' + f.replace('\\', '\\\\').replace('"', '\\"') + '"' for f in fields)
    else:
        rdata = ' '.join(fields)
    out.append(f"{name}\t{ttl}\tIN\t{rtype}\t{rdata}")
    counts[rtype] = counts.get(rtype, 0) + 1
print('\n'.join(out))
print(f"# kept {sum(counts.values())} records {counts}; dropped {len(dropped)}: {[(n,t) for n,t,_ in dropped]}", file=sys.stderr)
