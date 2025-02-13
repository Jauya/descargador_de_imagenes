import { useEffect, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Alert } from "@heroui/alert";
import { Skeleton } from "@heroui/skeleton";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";

import ImageCardFreepik from "./image-card/ImageCardFreepik";
import { CollectionActions } from "./CollectionActions";

import { FreepikData } from "@/types";
import { useApikeyStore } from "@/store/apikey";
import { getAllResources } from "@/actions/freepik";
import { useFreepikCollectionStore } from "@/store/collections";

const orientations = [
  { key: "landscape", label: "Paisaje" },
  { key: "portrait", label: "Retrato" },
  { key: "square", label: "Cuadrado" },
  { key: "panoramic", label: "Panorámico" }
];
const colors = [
  { key: "black", label: "Negro" },
  { key: "blue", label: "Azul" },
  { key: "gray", label: "Gris" },
  { key: "green", label: "Verde" },
  { key: "orange", label: "Naranja" },
  { key: "red", label: "Rojo" },
  { key: "white", label: "Blanco" },
  { key: "yellow", label: "Amarillo" },
  { key: "purple", label: "Morado" },
  { key: "cyan", label: "Cian" },
  { key: "pink", label: "Rosa" }
];
const imageTypes = [
  { key: "photo", label: "Foto" },
  { key: "psd", label: "PSD" },
  { key: "vector", label: "Vector" }
];
const orderBy = [
  { key: "relevance", label: "Relevancia" },
  { key: "recent", label: "Reciente" }
];
const licenses = [
  { key: "freemium", label: "Gratis" },
  { key: "premium", label: "Premium" }
];

export default function FreepikImages() {
  const [error, setError] = useState("");
  const [resources, setResources] = useState<FreepikData>();

  // collection store
  const {
    clearCollectionByResources,
    clearCollection,
    setCollection,
    collection
  } = useFreepikCollectionStore();

  // queryParams
  const [term] = useQueryState("term");
  const [page, setPage] = useQueryState("page", parseAsInteger);
  const [orientation, setOrientation] = useQueryState("orientation[freepik]");
  const [color, setColor] = useQueryState("color[freepik]");
  const [imageType, setImageType] = useQueryState("image[type][freepik]");
  const [order, setOrder] = useQueryState("order[freepik]");
  const [license, setLicense] = useQueryState("license");

  const { apikeys } = useApikeyStore();

  useEffect(() => {
    const getImages = async () => {
      const currentTerm = term?.trim() ?? "";
      const currentPage = page ?? 1;
      const currentOrientation = orientation?.trim() ?? "";
      const currentColor = color?.trim() ?? "";
      const currentImageType = imageType?.trim() ?? "";
      const currentOrder = order?.trim() ?? "";
      const currentLicense = license?.trim() ?? "";

      const { resData, resError } = await getAllResources(
        {
          term: currentTerm,
          limit: 50,
          page: currentPage,
          orientation: currentOrientation,
          color: currentColor,
          image_type: currentImageType,
          order: currentOrder,
          license: currentLicense
        },
        apikeys["freepik"]
      );

      if (!resError && resData?.data) {
        setResources(resData);
        setError("");
      } else {
        setError(resError || "");
      }
    };

    getImages();
  }, [page, term, orientation, color, imageType, order, license]);

  return (
    <div className="w-full p-6">
      {error ? (
        <Alert color="danger" title={error} />
      ) : (
        <>
          {resources !== undefined && page !== null ? (
            <div className="flex flex-col items-center w-full gap-5 relative">
              <div className="w-full flex gap-5">
                {/* Orientación */}
                <Select
                  aria-label="orientation-selector"
                  label="Orientación"
                  placeholder="Todas las orientaciones"
                  selectedKeys={[orientation ?? ""]}
                  variant="underlined"
                  onChange={(e) =>
                    setOrientation(e.target.value == "" ? null : e.target.value)
                  }
                >
                  {orientations.map(({ key, label }) => (
                    <SelectItem key={key}>{label}</SelectItem>
                  ))}
                </Select>
                {/* Color */}
                <Select
                  aria-label="color-selector"
                  label="Color"
                  placeholder="Todos los colores"
                  selectedKeys={[color ?? ""]}
                  variant="underlined"
                  onChange={(e) =>
                    setColor(e.target.value == "" ? null : e.target.value)
                  }
                >
                  {colors.map(({ key, label }) => (
                    <SelectItem key={key}>{label}</SelectItem>
                  ))}
                </Select>
                {/* Tipo de Imagen */}
                <Select
                  aria-label="image-type-selector"
                  label="Tipo de Imagen"
                  placeholder="Todos los tipos"
                  selectedKeys={[imageType ?? ""]}
                  variant="underlined"
                  onChange={(e) =>
                    setImageType(e.target.value == "" ? null : e.target.value)
                  }
                >
                  {imageTypes.map(({ key, label }) => (
                    <SelectItem key={key}>{label}</SelectItem>
                  ))}
                </Select>
                {/* Ordernar por */}
                <Select
                  aria-label="order-selector"
                  label="Ordenar"
                  placeholder="Relevancia (default)"
                  selectedKeys={[order ?? ""]}
                  variant="underlined"
                  onChange={(e) =>
                    setOrder(e.target.value == "" ? null : e.target.value)
                  }
                >
                  {orderBy.map(({ key, label }) => (
                    <SelectItem key={key}>{label}</SelectItem>
                  ))}
                </Select>
                {/* Licencia */}
                <Select
                  aria-label="color-selector"
                  label="Licencia"
                  placeholder="Todas"
                  selectedKeys={[license ?? ""]}
                  variant="underlined"
                  onChange={(e) =>
                    setLicense(e.target.value == "" ? null : e.target.value)
                  }
                >
                  {licenses.map(({ key, label }) => (
                    <SelectItem key={key}>{label}</SelectItem>
                  ))}
                </Select>
              </div>
              <div hidden={resources.meta.current_page === 0}>
                <Pagination
                  isCompact
                  loop
                  showControls
                  page={page}
                  total={Math.min(resources.meta.last_page, 100)}
                  onChange={setPage}
                />
              </div>
              {resources?.data.length !== 0 ? (
                <div className="sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4">
                  {resources?.data.map((resource) => (
                    <ImageCardFreepik
                      key={resource.title + resource.id}
                      resource={resource}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <p>No hay resultados</p>
                </div>
              )}
              <div hidden={resources.meta.current_page === 0}>
                <Pagination
                  isCompact
                  loop
                  showControls
                  page={page}
                  total={Math.min(resources.meta.last_page, 100)}
                  onChange={setPage}
                />
              </div>
              <CollectionActions
                clearCollection={clearCollection}
                clearCollectionByResources={clearCollectionByResources}
                collection={collection}
                resources={resources.data}
                setCollection={setCollection}
              />
            </div>
          ) : (
            <div className="flex flex-col max-sm:items-center w-full gap-5">
              <div className="flex justify-center w-full">
                <Skeleton className="w-[344px] h-10 rounded-xl" />
              </div>
              <Skeleton className="min-w-max max-sm:w-[360px] h-[5000px] rounded-xl" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
