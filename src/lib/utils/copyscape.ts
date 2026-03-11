/**
 * Copyscape Premium API client for plagiarism source matching.
 *
 * Docs: https://www.copyscape.com/apiconfigure.php
 * Searches the web for matching content and returns matched URLs with snippets.
 */

export interface CopyscapeMatch {
  url: string;
  title: string;
  percentmatched: number; // 0–100
  snippettext: string;
  htmlsnippet?: string;
  minwordsmatched: number;
  viewurl?: string;
}

export interface CopyscapeResult {
  querywords: number;
  allpercentmatched: number; // overall % of submitted text found online
  result?: CopyscapeMatch[];
  error?: string;
}

const COPYSCAPE_API_URL = 'https://www.copyscape.com/api/';

/**
 * Search the web for plagiarism matches using Copyscape Premium API.
 * Returns null if API credentials are missing or the request fails.
 */
export async function checkCopyscape(text: string): Promise<CopyscapeResult | null> {
  const username = process.env.COPYSCAPE_USERNAME;
  const apiKey = process.env.COPYSCAPE_API_KEY;

  if (!username || !apiKey) {
    console.warn('Copyscape credentials not configured — skipping plagiarism source check');
    return null;
  }

  try {
    // Copyscape Premium "search text" operation
    const params = new URLSearchParams({
      u: username,
      o: 'csearch',    // operation: search text against web
      k: apiKey,        // API key
      t: text,
      f: 'json',
      e: 'UTF-8',
    });

    const response = await fetch(COPYSCAPE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error(`Copyscape API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    // Copyscape returns error in the response body
    if (data.error) {
      console.error('Copyscape API error:', data.error);
      return null;
    }

    const querywords = parseInt(data.querywords, 10) || 1;

    // Copyscape doesn't return percentmatched per result — compute from minwordsmatched / querywords
    const results: CopyscapeMatch[] = Array.isArray(data.result)
      ? data.result.map((r: Record<string, string>) => {
          const wordsMatched = parseInt(r.minwordsmatched, 10) || 0;
          const percent = querywords > 0 ? Math.round((wordsMatched / querywords) * 100) : 0;
          return {
            url: r.url || '',
            title: r.title || '',
            percentmatched: parseFloat(r.percentmatched) || percent,
            snippettext: r.textsnippet || r.snippettext || '',
            htmlsnippet: r.htmlsnippet || '',
            minwordsmatched: wordsMatched,
            viewurl: r.viewurl || undefined,
          };
        })
      : [];

    // Compute overall percent: max of individual match percents, or from allpercentmatched if provided
    const maxMatchPercent = results.reduce((max, r) => Math.max(max, r.percentmatched), 0);
    const allPercent = parseFloat(data.allpercentmatched) || maxMatchPercent;

    return {
      querywords,
      allpercentmatched: allPercent,
      result: results,
    };
  } catch (err) {
    console.error('Copyscape request failed:', err);
    return null;
  }
}
