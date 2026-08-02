import { Navigate } from 'react-router-dom';
import { DOCS_DEFAULT_SLUG, docsPath, isDocsSlug } from './docsPath';

// /docs#<slug> was the old address of every docs page. A fragment never
// reaches the server, so no redirect rule can rescue those links; only the
// browser can. This stays for good.
export default function DocsEntry() {
  const hash =
    typeof window === 'undefined' ? '' : window.location.hash.replace(/^#/, '');
  const target = isDocsSlug(hash) ? hash : DOCS_DEFAULT_SLUG;

  return <Navigate to={docsPath(target)} replace />;
}
