import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "react-toastify";

import { Hit, Photo, Resource } from "@/types";

interface States<T> {
  loading: boolean;
  downloadCount: number;
  failedCount: number;

  collection: T[];
  limit: number;
}

interface Actions<T> {
  setLoading: (loading: boolean) => void;
  incrementDownloadCount: () => void;
  incrementFailedCount: () => void;
  resetDownloadCount: () => void;
  resetFailedCount: () => void;
  completeDownloadCount: () => void;

  setCollection: (resources: T[]) => void;
  toggleSelection: (resource: T) => void;
  clearCollectionByResources: (resources: T[]) => void;
  clearCollection: () => void;
}

type CollectionStore<T> = States<T> & Actions<T>;

const createCollectionStore = <T>(
  name: string,
  limit: number,
  getId: (item: T) => string
) =>
  create<CollectionStore<T>>()(
    persist(
      (set, get) => ({
        loading: false,
        downloadCount: 0,
        failedCount: 0,

        collection: [],
        limit,

        setLoading: (loading) => set({ loading }),
        incrementDownloadCount: () =>
          set({ downloadCount: get().downloadCount + 1 }),
        incrementFailedCount: () => set({ failedCount: get().failedCount + 1 }),
        resetDownloadCount: () => set({ downloadCount: 0 }),
        resetFailedCount: () => set({ failedCount: 0 }),
        completeDownloadCount: () =>
          set({ downloadCount: get().collection.length }),

        setCollection: (resources) => {
          const currentLoading = get().loading;
          const currentCollection = get().collection;

          if (currentLoading) {
            toast.warning("Aun se estan descargando archivos");

            return;
          }

          if (currentCollection.length >= limit) {
            toast.error(`Límite alcanzado (${limit} imágenes)`);

            return;
          }

          const newResources = resources.filter(
            (resource) =>
              !currentCollection.some((item) => getId(item) === getId(resource))
          );

          if (currentCollection.length + newResources.length > limit) {
            toast.warning(
              `Solo se agregró ${limit - currentCollection.length}`
            );
          }
          set({
            collection: [
              ...currentCollection,
              ...newResources.slice(0, limit - currentCollection.length)
            ]
          });
        },
        toggleSelection: (resource) => {
          const currentLoading = get().loading;
          const currentCollection = get().collection;
          const itemId = getId(resource);

          if (currentLoading) {
            toast.warning("Aun se estan descargando archivos");

            return;
          }

          if (currentCollection.some((item) => getId(item) === itemId)) {
            set({
              collection: currentCollection.filter(
                (item) => getId(item) !== itemId
              )
            });
          } else {
            if (currentCollection.length >= limit) {
              toast.error(`Límite alcanzado (${limit} imágenes)`);

              return;
            }
            set({
              collection: [...currentCollection, resource] // 🔥 Si no existe, lo agrega
            });
          }
        },
        clearCollectionByResources: (resources) => {
          const currentLoading = get().loading;
          const currentCollection = get().collection;

          if (currentLoading) {
            toast.warning("Aun se estan descargando archivos");

            return;
          }

          set({
            collection: [
              ...currentCollection.filter(
                (item) =>
                  !resources.some((resource) => getId(item) === getId(resource))
              )
            ]
          });
        },
        clearCollection: () => {
          const currentLoading = get().loading;

          if (currentLoading) {
            toast.warning("Aun se estan descargando archivos");

            return;
          }

          set({ collection: [] });
          toast.info("Colección vaciada");
        }
      }),
      {
        name,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          collection: state.collection,
          limit: state.limit
        })
      }
    )
  );

// ✅ Creando los stores específicos con `getId` definido correctamente
export const useFreepikCollectionStore = createCollectionStore<Resource>(
  "freepik-collection-store",
  50,
  (item) => item.id.toString() // 👈 Freepik usa `id`
);
export const usePexelsCollectionStore = createCollectionStore<Photo>(
  "pexels-collection-store",
  100,
  (item) => item.id.toString() // 👈 Pexels usa `id`
);
export const usePixabayCollectionStore = createCollectionStore<Hit>(
  "pixabay-collection-store",
  100,
  (item) => item.id.toString() // 👈 Pixabay usa `id`
);
