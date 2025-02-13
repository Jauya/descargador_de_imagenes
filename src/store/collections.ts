import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "react-toastify";

import { Hit, Photo, Resource } from "@/types";

interface States<T> {
  collection: T[];
  limit: number;
}

interface Actions<T> {
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
        collection: [],
        limit,
        setCollection: (resources) => {
          const currentCollection = get().collection;

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
          const currentCollection = get().collection;
          const itemId = getId(resource);

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
          const currentCollection = get().collection;

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
          set({ collection: [] });
          toast.info("Colección vaciada");
        }
      }),
      {
        name,
        storage: createJSONStorage(() => sessionStorage)
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
