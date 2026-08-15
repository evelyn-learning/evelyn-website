export interface ImageSearchResult {
  /** Direct image URL — should be loadable in a browser <img> tag. */
  url: string;
  /** Photographer-supplied alt text or description. May be empty. */
  alt: string;
  /** "Photo by X on Unsplash" / "Pixabay" / "Photo by X on Pexels".
   *  Some providers (Unsplash, Pexels) require attribution per their
   *  API terms. We always pass it through to the renderer's credit
   *  field even when not strictly required. */
  credit: string;
  /** Which provider this came from. For telemetry / debugging. */
  source: 'unsplash' | 'pixabay' | 'pexels';
}
