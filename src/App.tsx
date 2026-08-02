import { useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';

import DocsPage from './Platform/Docs';
import DocsEntry from './Platform/Docs/DocsEntry';

// The app decides its own scroll position on every navigation. Left on, the
// browser's restoration lands after that decision and undoes it, so a deep
// link with a fragment ends up back at the top of the page.
function useManualScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
}

// A fragment means the page asked for a specific anchor, so leave the scroll
// position to the browser in that case.
function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useManualScrollRestoration();

  return (
    <BrowserRouter>
      <RouteEffects />
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[3000] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-black'
      >
        Skip to content
      </a>
      <main id='main-content' tabIndex={-1} className='contents'>
        <Routes>
          <Route path='/' element={<DocsEntry />} />
          <Route path='/:slug' element={<DocsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
