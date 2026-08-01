import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { docsPath } from '../docsPath';

export function DocLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={docsPath(to)}>{children}</Link>;
}
