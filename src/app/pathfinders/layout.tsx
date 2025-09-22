import { ReactNode } from 'react';

interface PathfindersLayoutProps {
  children: ReactNode;
}

export default function PathfindersLayout({ children }: PathfindersLayoutProps) {
  return (
    <div className="pathfinders-module" style={{
      '--module-primary': '#3B82F6',
      '--module-secondary': '#8B5CF6',
      '--module-accent': '#06B6D4'
    } as React.CSSProperties}>
      {children}
    </div>
  );
}
