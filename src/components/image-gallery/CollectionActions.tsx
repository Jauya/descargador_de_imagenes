import { Button, ButtonGroup } from "@heroui/button";
import clsx from "clsx";
import { BsImage } from "react-icons/bs";

interface CollectionActionsProps<T> {
  resources: T[];
  collection: T[];
  setCollection: (resources: T[]) => void;
  clearCollectionByResources: (resources: T[]) => void;
  clearCollection: () => void;
}

export function CollectionActions<T>({
  resources,
  collection,
  setCollection,
  clearCollectionByResources,
  clearCollection
}: CollectionActionsProps<T>) {
  return (
    <div className="fixed flex gap-2 items-center bottom-8 left-48 z-20">
      <ButtonGroup>
        <Button
          className="bg-neutral-800/90 text-neutral-50 backdrop-blur-sm shadow-neutral-950/30"
          onPress={() => setCollection(resources)}
        >
          Seleccionar página
        </Button>
        <Button
          className="bg-neutral-800/90 text-neutral-50 backdrop-blur-sm shadow-neutral-950/30"
          onPress={() => clearCollectionByResources(resources)}
        >
          Deseleccionar página
        </Button>
        <Button
          className="bg-neutral-800/90 text-neutral-50 backdrop-blur-sm shadow-neutral-950/30"
          onPress={() => clearCollection()}
        >
          Vaciar colección
        </Button>
      </ButtonGroup>
      <div
        className={clsx(
          "flex items-center gap-1 bg-neutral-800/90 text-neutral-50 backdrop-blur-sm shadow-neutral-950/30 py-2 px-4 rounded-xl transition-opacity duration-300",
          collection.length > 1 ? "opacity-100" : "opacity-0"
        )}
      >
        <BsImage className="size-4" />
        {collection.length}
      </div>
    </div>
  );
}
