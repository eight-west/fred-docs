import { renderToString } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import DocsPage from './Platform/Docs';

// Build-time only: scripts/prerender.mjs renders every docs page through this,
// so crawlers get the whole page rather than its heading and summary.
export function render(path: string): string {
  return renderToString(
    <StaticRouter location={path}>
      <Routes>
        <Route path='/:slug' element={<DocsPage />} />
      </Routes>
    </StaticRouter>
  );
}
