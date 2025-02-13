import { useEffect, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Alert } from "@heroui/alert";
import { Skeleton } from "@heroui/skeleton";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";

import ImageCardPexels from "./image-card/ImageCardPexels";
import { CollectionActions } from "./CollectionActions";

import { searchPhotos } from "@/actions/pexels";
import { PexelsData } from "@/types";
import { useApikeyStore } from "@/store/apikey";
import { usePexelsCollectionStore } from "@/store/collections";

const orientations = [
  { key: "landscape", label: "Paisaje" },
  { key: "portrait", label: "Retrato" },
  { key: "square", label: "Cuadrado" }
];

const colors = [
  { key: "FF0000", label: "Rojo" },
  { key: "FF5F1F", label: "Naranja" },
  { key: "FFFF00", label: "Amarillo" },
  { key: "008000", label: "Verde" },
  { key: "40E0D0", label: "Turquesa" },
  { key: "0000FF", label: "Azul" },
  { key: "7F00FF", label: "Violeta" },
  { key: "FF0080", label: "Rosa" },
  { key: "7B3F00", label: "Marrón" },
  { key: "000000", label: "Negro" },
  { key: "808080", label: "Gris" },
  { key: "FFFFFF", label: "Blanco" }
];

const locales = [
  { key: "en-US", label: "Inglés (EE.UU.)" },
  { key: "pt-BR", label: "Portugués (Brasil)" },
  { key: "es-ES", label: "Español (España)" },
  { key: "ca-ES", label: "Catalán (España)" },
  { key: "de-DE", label: "Alemán (Alemania)" },
  { key: "it-IT", label: "Italiano (Italia)" },
  { key: "fr-FR", label: "Francés (Francia)" },
  { key: "sv-SE", label: "Sueco (Suecia)" },
  { key: "id-ID", label: "Indonesio (Indonesia)" },
  { key: "pl-PL", label: "Polaco (Polonia)" },
  { key: "ja-JP", label: "Japonés (Japón)" },
  { key: "zh-TW", label: "Chino (Taiwán)" },
  { key: "zh-CN", label: "Chino (China)" },
  { key: "ko-KR", label: "Coreano (Corea del Sur)" },
  { key: "th-TH", label: "Tailandés (Tailandia)" },
  { key: "nl-NL", label: "Holandés (Países Bajos)" },
  { key: "hu-HU", label: "Húngaro (Hungría)" },
  { key: "vi-VN", label: "Vietnamita (Vietnam)" },
  { key: "cs-CZ", label: "Checo (República Checa)" },
  { key: "da-DK", label: "Danés (Dinamarca)" },
  { key: "fi-FI", label: "Finlandés (Finlandia)" },
  { key: "uk-UA", label: "Ucraniano (Ucrania)" },
  { key: "el-GR", label: "Griego (Grecia)" },
  { key: "ro-RO", label: "Rumano (Rumania)" },
  { key: "nb-NO", label: "Noruego (Noruega)" },
  { key: "sk-SK", label: "Eslovaco (Eslovaquia)" },
  { key: "tr-TR", label: "Turco (Turquía)" },
  { key: "ru-RU", label: "Ruso (Rusia)" }
];

export default function PexelsImages() {
  const [error, setError] = useState("");
  const [resources, setResources] = useState<PexelsData>();

  // collection store
  const {
    clearCollectionByResources,
    clearCollection,
    setCollection,
    collection
  } = usePexelsCollectionStore();

  // queryParams
  const [term] = useQueryState("term");
  const [color, setColor] = useQueryState("color[pexels]");
  const [orientation, setOrientation] = useQueryState("orientation[pexels]");
  const [locale, setLocale] = useQueryState("locale");
  const [page, setPage] = useQueryState("page", parseAsInteger);

  const { apikeys } = useApikeyStore();

  useEffect(() => {
    const getImages = async () => {
      const currentTerm = term?.trim() ?? "amazing";
      const currentPage = page ?? 1;
      const currentOrientation = orientation?.trim() ?? "";
      const currentColor = color?.trim() ?? "";
      const currentLocale = locale?.trim() ?? "";

      const { resData, resError } = await searchPhotos(
        {
          query: currentTerm,
          per_page: 50,
          page: currentPage,
          orientation: currentOrientation,
          color: currentColor,
          locale: currentLocale
        },
        apikeys["pexels"]
      );

      if (!resError && resData?.photos) {
        setResources(resData);
        setError("");
      } else {
        setError(resError || "");
      }
    };

    getImages();
  }, [page, term, color, orientation, locale]);

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
                {/* Idioma */}
                <Select
                  aria-label="locale-selector"
                  label="Idioma"
                  placeholder="Inglés (default)"
                  selectedKeys={[locale ?? ""]}
                  variant="underlined"
                  onChange={(e) =>
                    setLocale(e.target.value == "" ? null : e.target.value)
                  }
                >
                  {locales.map(({ key, label }) => (
                    <SelectItem key={key}>{label}</SelectItem>
                  ))}
                </Select>
              </div>
              <div hidden={resources.total_results === 0}>
                <Pagination
                  isCompact
                  loop
                  showControls
                  page={page}
                  total={Math.ceil(
                    resources.total_results / resources.per_page
                  )}
                  onChange={setPage}
                />
              </div>
              {resources?.photos.length !== 0 ? (
                <div className="sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4">
                  {resources?.photos.map((photo) => (
                    <ImageCardPexels key={photo.alt + photo.id} photo={photo} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <p>No hay resultados</p>
                </div>
              )}
              <div hidden={resources.total_results === 0}>
                <Pagination
                  isCompact
                  loop
                  showControls
                  page={page}
                  total={Math.ceil(
                    resources.total_results / resources.per_page
                  )}
                  onChange={setPage}
                />
              </div>
              <CollectionActions
                clearCollection={clearCollection}
                clearCollectionByResources={clearCollectionByResources}
                collection={collection}
                resources={resources.photos}
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
