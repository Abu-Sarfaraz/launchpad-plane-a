'use client';

import React, { useMemo } from 'react';
import { renderMixedLatexToHtml } from '@/lib/math/katex';

interface MathRendererProps {
  content: string;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

export function MathRenderer({
  content,
  className = '',
  as: Component = 'span',
}: MathRendererProps) {
  const html = useMemo(() => renderMixedLatexToHtml(content), [content]);

  return (
    <Component
      className={`katex-rendered ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
