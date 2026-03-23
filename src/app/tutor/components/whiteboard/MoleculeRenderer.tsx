'use client';

/**
 * Molecule Renderer
 *
 * Renders molecular structures using Ketcher in an isolated iframe.
 * The iframe has its own React root and WASM context, preventing
 * conflicts with our app's React reconciliation.
 *
 * Features:
 * - SMILES → 2D structural formula (via Indigo WASM in Ketcher)
 * - Interactive editing — students can modify molecules
 * - Change detection — notifies parent when student modifies structure
 * - SVG export for PDF
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface MoleculeRendererProps {
  smiles: string;
  title?: string;
  description?: string;
  interactive?: boolean;
  className?: string;
  onMoleculeChanged?: (newSmiles: string) => void;
}

export default function MoleculeRenderer({
  smiles,
  title,
  description,
  interactive = false,
  className = '',
  onMoleculeChanged,
}: MoleculeRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingSmilesRef = useRef<string>(smiles);

  // Listen for messages from the Ketcher iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data || {};

      if (type === 'ketcher-ready') {
        setReady(true);
        // Send pending SMILES
        if (iframeRef.current?.contentWindow && pendingSmilesRef.current) {
          iframeRef.current.contentWindow.postMessage({
            type: 'set-molecule',
            smiles: pendingSmilesRef.current,
          }, '*');
        }
      }

      if (type === 'ketcher-error') {
        console.error('[MoleculeRenderer] Ketcher error:', event.data.error);
        setError(event.data.error);
      }

      if (type === 'molecule-changed' && onMoleculeChanged) {
        onMoleculeChanged(event.data.smiles);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onMoleculeChanged]);

  // Send SMILES to iframe when it changes
  useEffect(() => {
    pendingSmilesRef.current = smiles;
    if (ready && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'set-molecule',
        smiles,
      }, '*');
    }
  }, [smiles, ready]);

  // Export SVG (for PDF export)
  const exportSvg = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!ready || !iframeRef.current?.contentWindow) {
        resolve(null);
        return;
      }

      const handleSvg = (event: MessageEvent) => {
        if (event.data?.type === 'ketcher-svg') {
          window.removeEventListener('message', handleSvg);
          resolve(event.data.svg);
        }
      };
      window.addEventListener('message', handleSvg);
      // Timeout after 5s
      setTimeout(() => {
        window.removeEventListener('message', handleSvg);
        resolve(null);
      }, 5000);

      iframeRef.current.contentWindow.postMessage({ type: 'get-svg' }, '*');
    });
  }, [ready]);

  if (error) {
    return (
      <div className={`molecule-container ${className}`}>
        {title && <h4 className="text-center font-medium text-gray-800 mb-2">{title}</h4>}
        <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center">
          <p className="text-red-600 text-sm">Could not load chemistry editor</p>
          <p className="font-mono text-xs text-gray-500 mt-2">SMILES: {smiles}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`molecule-container ${className}`}>
      {title && (
        <h4 className="text-center font-medium text-gray-800 mb-2">{title}</h4>
      )}
      {description && (
        <p className="text-center text-sm text-gray-500 mb-2">{description}</p>
      )}

      {/* Ketcher iframe — isolated from our React tree */}
      <div className="rounded-xl border border-blue-200 overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          src="/ketcher/index.html"
          className="w-full border-0"
          style={{ height: interactive ? 400 : 300 }}
          sandbox="allow-scripts allow-same-origin"
          title={`Molecule: ${title || smiles}`}
        />

        {/* Info bar */}
        <div className="px-4 py-2 border-t border-blue-100 bg-blue-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs">🧪</span>
            {title && <span className="text-sm font-medium text-gray-700">{title}</span>}
            <span className="font-mono text-xs text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-100">
              {smiles}
            </span>
          </div>
          {interactive && (
            <span className="text-xs text-blue-500">Edit the structure above</span>
          )}
        </div>
      </div>
    </div>
  );
}
