import { ReactNode } from 'react';

interface LaunchContestLayoutProps {
  children: ReactNode;
}

export default function LaunchContestLayout({ children }: LaunchContestLayoutProps) {
  return (
    <div className="launch-contest-module" style={{
      '--module-primary': '#00ffff',
      '--module-secondary': '#ff00ff',
      '--module-accent': '#ffff00',
      '--module-bg': '#0a0a0f',
      '--module-surface': '#1a1a2e',
      '--module-text': '#ffffff',
      '--module-border': '#16213e'
    } as React.CSSProperties}>
      {children}
    </div>
  );
}
