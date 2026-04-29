import React, { useEffect, useRef, useState } from 'react';

interface AdSlotProps {
  id: string;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layout?: 'in-article' | 'in-feed' | 'sticky-bottom';
}

/**
 * A responsive Google AdSense slot placeholder.
 *
 * To activate real ads later:
 * 1. Add your Google AdSense script to the document <head>.
 * 2. Pass your `data-ad-client` (e.g. "ca-pub-XXXXXXXXXXXXXXXX") and `data-ad-slot` IDs to this component.
 * 3. Uncomment the AdSense push code in the useEffect.
 */
export function AdSlot({ id, className = '', format = 'auto', layout }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (adRef.current && !adLoaded) {
      try {
        // @ts-expect-error - adsbygoogle is a global variable
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (err) {
        console.error('AdSense push error:', err);
      }
    }
  }, [adLoaded]);

  // For now, in development/placeholder mode, we show a dummy box to test layout.
  // We check an environment variable or just render a placeholder if window.adsbygoogle is undefined.
  const isDev =
    typeof window !== 'undefined' && !Object.prototype.hasOwnProperty.call(window, 'adsbygoogle');

  if (layout === 'sticky-bottom') {
    if (isDev) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-surface-card border-t border-border p-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '320px', height: '50px' }}
          data-ad-client="ca-pub-placeholder"
          data-ad-slot={id}
        />
      </div>
    );
  }

  return (
    <div className={`w-full flex justify-center my-6 ${className}`}>
      {isDev ? (
        <div className="w-full max-w-[728px] h-[90px] bg-border/30 rounded flex items-center justify-center text-xs text-ink-muted">
          Ad Placeholder ({layout || format})
        </div>
      ) : (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-placeholder"
          data-ad-slot={id}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
