// Prices Claude API usage for the lead-research worker and enforces the
// batch cost ceiling. Rates are claude-opus-5 list prices.
export interface UsageLike {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
  server_tool_use?: { web_search_requests?: number } | null;
}

const INPUT_PER_MTOK = 5;
const OUTPUT_PER_MTOK = 25;
const CACHE_WRITE_MULT = 1.25;
const CACHE_READ_MULT = 0.1;
const WEB_SEARCH_PER_REQUEST = 0.01;

export function priceUsageUsd(u: UsageLike): number {
  const per = (tokens: number, ratePerMTok: number) => (tokens / 1_000_000) * ratePerMTok;
  return (
    per(u.input_tokens ?? 0, INPUT_PER_MTOK) +
    per(u.output_tokens ?? 0, OUTPUT_PER_MTOK) +
    per(u.cache_creation_input_tokens ?? 0, INPUT_PER_MTOK * CACHE_WRITE_MULT) +
    per(u.cache_read_input_tokens ?? 0, INPUT_PER_MTOK * CACHE_READ_MULT) +
    (u.server_tool_use?.web_search_requests ?? 0) * WEB_SEARCH_PER_REQUEST
  );
}

export function costCapUsd(): number {
  const raw = Number(process.env.LEAD_RESEARCH_COST_CAP_USD);
  return Number.isFinite(raw) && raw > 0 ? raw : 20;
}
