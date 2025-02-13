import { useState } from "react";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { toast } from "react-toastify";
import { FiDownload } from "react-icons/fi";

import { Hit } from "@/types";
import { usePixabayCollectionStore } from "@/store/collections";
import { downloadImage } from "@/actions/downloadImage";

interface ImageCardPixabayProps {
  hit: Hit;
}
export default function ImageCardPixabay({ hit }: ImageCardPixabayProps) {
  const { toggleSelection, collection } = usePixabayCollectionStore();
  const currentSelected = collection.some((h) => h.id == hit.id);

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const { resData, resError } = await downloadImage(hit.largeImageURL);

    if (resError) {
      toast.error(`${resError}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "light"
      });

      return;
    }

    if (!resData) {
      toast.error("Ocurrió un error desconocido", {
        position: "top-right",
        autoClose: 5000,
        theme: "light"
      });

      return;
    }

    // Crear URL para el Blob y descargar
    const blobUrl = URL.createObjectURL(resData);
    const a = document.createElement("a");

    a.href = blobUrl;
    a.download = `${hit.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl); // Liberar memoria

    toast.success("Descarga completada", {
      position: "top-right",
      autoClose: 3000,
      theme: "light"
    });
    setLoading(false);
  };

  return (
    <div className="group mb-4 break-inside-avoid relative">
      <Image
        alt={hit.tags}
        className="object-cover w-full"
        height={(360 * hit.webformatHeight) / hit.webformatWidth}
        radius="lg"
        src={hit.webformatURL}
        width={360}
      />
      <div className="absolute z-20 top-3 right-2.5 rounded-lg">
        <Checkbox
          aria-label={hit.tags}
          isSelected={currentSelected}
          onValueChange={() => toggleSelection(hit)}
        />
      </div>
      <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 absolute z-20 bottom-3 right-2.5 rounded-lg">
        <Button
          color="success"
          isLoading={loading}
          startContent={!loading && <FiDownload className="size-5" />}
          onPress={() => handleDownload()}
        >
          Descargar
        </Button>
      </div>
    </div>
  );
}
