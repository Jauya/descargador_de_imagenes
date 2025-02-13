import { useEffect, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Alert } from "@heroui/alert";
import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import { Pagination } from "@heroui/pagination";

import ImageCardPixabay from "./image-card/ImageCardPixabay";
import { CollectionActions } from "./CollectionActions";

import { searchImages } from "@/actions/pixabay";
import { PixabayData } from "@/types";
import { useApikeyStore } from "@/store/apikey";
import { usePixabayCollectionStore } from "@/store/collections";

const orientations = [
  { key: "horizontal", label: "Horizontal" },
  { key: "vertical", label: "Vertical" }
];

const colors = [
  { key: "grayscale", label: "Escala de grises" },
  { key: "transparent", label: "Transparente" },
  { key: "red", label: "Rojo" },
  { key: "orange", label: "Naranja" },
  { key: "yellow", label: "Amarillo" },
  { key: "green", label: "Verde" },
  { key: "turquoise", label: "Turquesa" },
  { key: "blue", label: "Azul" },
  { key: "lilac", label: "Lila" },
  { key: "pink", label: "Rosa" },
  { key: "white", label: "Blanco" },
  { key: "gray", label: "Gris" },
  { key: "black", label: "Negro" },
  { key: "brown", label: "Marrón" }
];
const languages = [
  { key: "en", label: "Inglés" },
  { key: "es", label: "Español" },
  { key: "cs", label: "Checo" },
  { key: "da", label: "Danés" },
  { key: "de", label: "Alemán" },
  { key: "fr", label: "Francés" },
  { key: "id", label: "Indonesio" },
  { key: "it", label: "Italiano" },
  { key: "hu", label: "Húngaro" },
  { key: "nl", label: "Neerlandés" },
  { key: "no", label: "Noruego" },
  { key: "pl", label: "Polaco" },
  { key: "pt", label: "Portugués" },
  { key: "ro", label: "Rumano" },
  { key: "sk", label: "Eslovaco" },
  { key: "fi", label: "Finlandés" },
  { key: "sv", label: "Sueco" },
  { key: "tr", label: "Turco" },
  { key: "vi", label: "Vietnamita" },
  { key: "th", label: "Tailandés" },
  { key: "bg", label: "Búlgaro" },
  { key: "ru", label: "Ruso" },
  { key: "el", label: "Griego" },
  { key: "ja", label: "Japonés" },
  { key: "ko", label: "Coreano" },
  { key: "zh", label: "Chino" }
];
const imageTypes = [
  { key: "photo", label: "Foto" },
  { key: "vector", label: "Vector" },
  { key: "illustration", label: "Ilustración" }
];
const orderBy = [
  { key: "popular", label: "Popular" },
  { key: "latest", label: "Reciente" }
];

export default function PixabayImages() {
  const [error, setError] = useState("");
  const [resources, setResources] = useState<PixabayData>();

  // collection store
  const {
    clearCollectionByResources,
    clearCollection,
    setCollection,
    collection
  } = usePixabayCollectionStore();

  // queryParams
  const [term] = useQueryState("term");
  const [page, setPage] = useQueryState("page", parseAsInteger);
  const [color, setColor] = useQueryState("color[pixabay]");
  const [orientation, setOrientation] = useQueryState("orientation[pixabay]");
  const [lang, setLang] = useQueryState("lang");
  const [imageType, setImageType] = useQueryState("image[type][pixabay]");
  const [order, setOrder] = useQueryState("order[pixabay]");

  const { apikeys } = useApikeyStore();

  useEffect(() => {
    const getImages = async () => {
      const currentTerm = term?.trim() ?? "";
      const currentPage = page ?? 1;
      const currentColor = color?.trim() ?? "";
      const currentOrientation = orientation?.trim() ?? "";
      const currentLang = lang?.trim() ?? "";
      const currentImageType = imageType?.trim() ?? "";
      const currentOrder = order?.trim() ?? "";

      const { resData, resError } = await searchImages(
        {
          q: currentTerm,
          per_page: 50,
          page: currentPage,
          orientation: currentOrientation,
          color: currentColor,
          lang: currentLang,
          image_type: currentImageType,
          order: currentOrder
        },
        apikeys["pixabay"]
      );

      if (!resError && resData?.hits) {
        setResources(resData);
        setError("");
      } else {
        setError(resError || "");
      }
    };

    getImages();
  }, [page, term, color, orientation, lang, imageType, order]);

  return (
    <div className="w-full p-6">
      {error ? (
        <div className="flex justify-center w-full p-2">
          <Alert color="danger" title={error} />
        </div>
      ) : (
        <>
          {resources !== undefined && page !== null ? (
            <div className="flex flex-col items-center w-full gap-5 relative">
              <div className="w-full flex gap-5">
                {/* Orientacion */}
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
                {/* Idioma */}
                <Select
                  aria-label="lang-selector"
                  label="Idioma"
                  placeholder="Inglés (default)"
                  selectedKeys={[lang ?? ""]}
                  variant="underlined"
                  onChange={(e) =>
                    setLang(e.target.value == "" ? null : e.target.value)
                  }
                >
                  {languages.map(({ key, label }) => (
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
                  placeholder="Popular (default)"
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
              </div>
              <div hidden={resources.total === 0}>
                <Pagination
                  isCompact
                  loop
                  showControls
                  page={page}
                  total={Math.ceil(resources.totalHits / 50)}
                  onChange={setPage}
                />
              </div>
              {resources?.hits.length !== 0 ? (
                <div className="sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4">
                  {resources?.hits.map((hit) => (
                    <ImageCardPixabay key={hit.user_id + hit.id} hit={hit} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <p>No hay resultados</p>
                </div>
              )}
              <div hidden={resources.total === 0}>
                <Pagination
                  isCompact
                  loop
                  showControls
                  page={page}
                  total={Math.ceil(resources.totalHits / 50)}
                  onChange={setPage}
                />
              </div>
              <CollectionActions
                clearCollection={clearCollection}
                clearCollectionByResources={clearCollectionByResources}
                collection={collection}
                resources={resources.hits}
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
