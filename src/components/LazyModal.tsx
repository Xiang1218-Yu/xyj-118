import { Suspense, lazy, ComponentType, JSX } from 'react';
import { LazyLoader } from './LazyLoader';

function createLazyModal(
  importFn: () => Promise<{ [key: string]: ComponentType<Record<string, unknown>> }>,
  exportName: string
) {
  const LazyComponent = lazy(() =>
    importFn().then((module) => ({
      default: module[exportName] as ComponentType<Record<string, unknown>>,
    }))
  );

  return function WrappedLazyModal(props: Record<string, unknown> & { isOpen?: boolean }): JSX.Element | null {
    if (props.isOpen === false) return null;
    
    return (
      <Suspense fallback={<LazyLoader fullScreen />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export const LazyHistoryModal = createLazyModal(
  () => import('@/components/HistoryModal') as unknown as Promise<{ HistoryModal: ComponentType<Record<string, unknown>> }>,
  'HistoryModal'
);

export const LazySurpriseLibraryModal = createLazyModal(
  () => import('@/components/SurpriseLibraryModal') as unknown as Promise<{ SurpriseLibraryModal: ComponentType<Record<string, unknown>> }>,
  'SurpriseLibraryModal'
);

export const LazyEditActivityModal = createLazyModal(
  () => import('@/components/EditActivityModal') as unknown as Promise<{ EditActivityModal: ComponentType<Record<string, unknown>> }>,
  'EditActivityModal'
);

export const LazyVenueSelectorModal = createLazyModal(
  () => import('@/components/VenueSelectorModal') as unknown as Promise<{ VenueSelectorModal: ComponentType<Record<string, unknown>> }>,
  'VenueSelectorModal'
);

export const LazyIdeaForm = createLazyModal(
  () => import('@/components/IdeaForm') as unknown as Promise<{ IdeaForm: ComponentType<Record<string, unknown>> }>,
  'IdeaForm'
);
