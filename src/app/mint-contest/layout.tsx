import React from 'react';

export default function MintContestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="mint-contest-layout"
      style={{
        '--mint-primary': '#ff6b6b',
        '--mint-secondary': '#4ecdc4',
        '--mint-accent': '#ffe66d',
        '--mint-bg': '#2d3436',
        '--mint-surface': '#636e72',
        '--mint-text': '#ddd',
        '--mint-border': '#74b9ff'
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
