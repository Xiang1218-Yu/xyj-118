import { useCallback } from 'react';

type PageLoader = () => Promise<unknown>;

const pageLoaders: Record<string, PageLoader> = {
  '/plan': () => import('@/pages/PlanPage'),
  '/ideas': () => import('@/pages/IdeasPage'),
  '/': () => import('@/pages/HomePage'),
};

const loadedPages = new Set<string>();

export function usePrefetch() {
  const prefetchPage = useCallback((path: string) => {
    if (loadedPages.has(path)) return;
    
    const loader = pageLoaders[path];
    if (loader) {
      loadedPages.add(path);
      loader().catch(() => {
        loadedPages.delete(path);
      });
    }
  }, []);

  const prefetchComponent = useCallback((loader: () => Promise<unknown>) => {
    loader().catch(() => {});
  }, []);

  return { prefetchPage, prefetchComponent };
}
