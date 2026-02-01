'use client';

/**
 * Equation Renderer
 *
 * Renders LaTeX equations using KaTeX with optional highlighting
 * and labels for step-by-step explanations.
 */

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface EquationRendererProps {
  latex: string;
  label?: string;
  highlight?: string[];
  className?: string;
  displayMode?: boolean;
}

export function EquationRenderer({
  latex,
  label,
  highlight,
  className = '',
  displayMode = true,
}: EquationRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Process highlighting if specified
      let processedLatex = latex;
      if (highlight && highlight.length > 0) {
        // Wrap highlighted terms in a colored box
        highlight.forEach((term) => {
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          processedLatex = processedLatex.replace(
            new RegExp(escapedTerm, 'g'),
            `\\colorbox{yellow}{$${term}$}`
          );
        });
      }

      katex.render(processedLatex, containerRef.current, {
        throwOnError: false,
        displayMode,
        trust: true,
        strict: false,
        macros: {
          // Common physics/math macros
          '\\vec': '\\mathbf{#1}',
          '\\unit': '\\,\\mathrm{#1}',
          '\\ms': '\\,\\mathrm{m/s}',
          '\\mss': '\\,\\mathrm{m/s^2}',
          '\\m': '\\,\\mathrm{m}',
          '\\s': '\\,\\mathrm{s}',
          '\\kg': '\\,\\mathrm{kg}',
          '\\N': '\\,\\mathrm{N}',
          '\\J': '\\,\\mathrm{J}',
        },
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      if (containerRef.current) {
        containerRef.current.textContent = latex;
      }
    }
  }, [latex, highlight, displayMode]);

  return (
    <div className={`equation-container ${className}`}>
      {label && (
        <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
      )}
      <div
        ref={containerRef}
        className="equation-content overflow-x-auto py-2"
      />
    </div>
  );
}

/**
 * Inline equation for use within text
 */
export function InlineEquation({ latex }: { latex: string }) {
  return (
    <EquationRenderer
      latex={latex}
      displayMode={false}
      className="inline-block"
    />
  );
}

/**
 * Equation with step-by-step derivation
 */
interface DerivationStep {
  equation: string;
  explanation?: string;
}

interface DerivationRendererProps {
  steps: DerivationStep[];
  title?: string;
}

export function DerivationRenderer({ steps, title }: DerivationRendererProps) {
  return (
    <div className="derivation-container space-y-3">
      {title && (
        <h4 className="font-medium text-gray-800">{title}</h4>
      )}
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          <span className="text-gray-400 font-mono text-sm mt-2">
            {index + 1}.
          </span>
          <div className="flex-1">
            <EquationRenderer latex={step.equation} />
            {step.explanation && (
              <p className="text-sm text-gray-500 mt-1 ml-1">
                {step.explanation}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
