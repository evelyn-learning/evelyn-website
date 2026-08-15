/**
 * Shared DiagramNotes component.
 *
 * Renders an optional caption *below* the SVG as an HTML <div> so long text
 * wraps naturally rather than getting clipped by the SVG viewBox. Used by
 * every Tier-1 structured renderer.
 */

import React from 'react';
import { DIAGRAM_COLORS } from './theme';

export function DiagramNotes({ notes }: { notes?: string }): React.ReactElement | null {
  if (!notes) return null;
  return (
    <div style={{
      textAlign: 'center',
      fontSize: 11,
      color: DIAGRAM_COLORS.muted,
      fontStyle: 'italic',
      marginTop: 4,
      lineHeight: 1.35,
      padding: '0 4px',
    }}>
      {notes}
    </div>
  );
}
