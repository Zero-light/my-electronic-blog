import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function MdxContent({ children }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {children}
    </div>
  );
}
