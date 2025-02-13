import { useState } from "react";
import { toast } from "react-toastify";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { FiDownload } from "react-icons/fi";
import { useQueryState } from "nuqs";

import { Resource } from "@/types";
import { useFreepikCollectionStore } from "@/store/collections";
import { downloadImage } from "@/actions/downloadImage";
import { downloadResource } from "@/actions/freepik";
import { useApikeyStore } from "@/store/apikey";

interface ImageCardFreepikProps {
  resource: Resource;
}

export default function ImageCardFreepik({ resource }: ImageCardFreepikProps) {
  const [provider] = useQueryState("provider");
  const { apikeys } = useApikeyStore();
  const { toggleSelection, collection } = useFreepikCollectionStore();
  const currentSelected = collection.some((r) => r.id === resource.id);

  const [widthStr, heightStr] = resource.image.source.size.split("x");
  const width = 360;
  const height = (width * parseInt(heightStr, 10)) / parseInt(widthStr, 10);

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    // 🔹 Obtener la URL de descarga desde la API
    const { resData, resError } = await downloadResource(
      resource.id,
      apikeys[provider ?? ""]
    );

    if (resError || !resData?.data?.[0]) {
      toast.error(resError ?? "No se pudo obtener la URL de descarga.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light"
      });
      setLoading(false);

      return;
    }

    const { url, filename } = resData.data[0];

    // 🔹 Descargar la imagen desde la URL obtenida
    const { resData: blobData, resError: blobError } = await downloadImage(url);

    if (blobError || !blobData) {
      toast.error(blobError ?? "Error al descargar la imagen.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light"
      });
      setLoading(false);

      return;
    }

    // 🔹 Crear URL para el Blob y descargar
    const blobUrl = URL.createObjectURL(blobData);
    const a = document.createElement("a");

    a.href = blobUrl;
    a.download = filename ?? `${resource.id}.jpg`; // Usa el filename si está disponible
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl); // Liberar memoria

    toast.success("Descarga completada ✅", {
      position: "top-right",
      autoClose: 3000,
      theme: "light"
    });

    setLoading(false);
  };

  return (
    <div className="group mb-4 break-inside-avoid relative">
      <Image
        alt={resource.title}
        className="object-cover w-full"
        height={height}
        radius="lg"
        src={resource.image.source.url}
        width={width}
      />
      <div
        className="absolute z-20 top-3 left-3 rounded-lg bg-white/60 backdrop-blur-sm px-2 py-1"
        hidden={resource.licenses[0].type === "freemium"}
      >
        <p>Premium</p>
      </div>
      <div className="absolute z-20 top-3 right-2.5 rounded-lg">
        <Checkbox
          aria-label={resource.title}
          isSelected={currentSelected}
          onValueChange={() => toggleSelection(resource)}
        />
      </div>
      <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 absolute z-20 bottom-3 right-2.5 rounded-lg">
        <Button
          color="success"
          isLoading={loading}
          startContent={!loading && <FiDownload className="size-5" />}
          onPress={handleDownload}
        >
          Descargar
        </Button>
      </div>
    </div>
  );
}
