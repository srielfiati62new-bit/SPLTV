import katex from 'katex';
import React from 'react';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Renders Indonesian instructional text with embedded KaTeX math:
 * - Block math: $$ ... $$
 * - Inline math: $ ... $
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const parts = React.useMemo(() => {
    const tokens: { type: 'text' | 'inline' | 'block'; content: string }[] = [];
    // Split block math $$...$$ first, then inline $...$
    const blockRegex = /\$\$([\s\S]*?)\$\$/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    const pushInlineAndText = (segment: string) => {
      const inlineRegex = /\$([^$]+?)\$/g;
      let innerLast = 0;
      let innerMatch: RegExpExecArray | null;
      while ((innerMatch = inlineRegex.exec(segment)) !== null) {
        if (innerMatch.index > innerLast) {
          tokens.push({ type: 'text', content: segment.slice(innerLast, innerMatch.index) });
        }
        tokens.push({ type: 'inline', content: innerMatch[1] });
        innerLast = inlineRegex.lastIndex;
      }
      if (innerLast < segment.length) {
        tokens.push({ type: 'text', content: segment.slice(innerLast) });
      }
    };

    while ((match = blockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        pushInlineAndText(text.slice(lastIndex, match.index));
      }
      tokens.push({ type: 'block', content: match[1] });
      lastIndex = blockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      pushInlineAndText(text.slice(lastIndex));
    }

    return tokens;
  }, [text]);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.type === 'text') {
          return <React.Fragment key={idx}>{part.content}</React.Fragment>;
        }
        const html = katex.renderToString(part.content, {
          displayMode: part.type === 'block',
          throwOnError: false,
          strict: false,
        });
        if (part.type === 'block') {
          return (
            <span
              key={idx}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        return (
          <span
            key={idx}
            className="inline-block align-baseline mx-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
};

interface MathBlockProps {
  math: string;
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({ math, className = '' }) => {
  const html = React.useMemo(() => {
    return katex.renderToString(math, {
      displayMode: true,
      throwOnError: false,
      strict: false,
    });
  }, [math]);

  return (
    <div
      className={`overflow-x-auto py-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
