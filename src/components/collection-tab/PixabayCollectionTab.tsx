import { useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { toast } from "react-toastify";
import { FiDownload } from "react-icons/fi";
import clsx from "clsx";
import { BlobWriter, ZipWriter } from "@zip.js/zip.js";

import { downloadImage } from "@/actions/downloadImage";
import { usePixabayCollectionStore } from "@/store/collections";

export default function PixabayCollectionTab() {
  const { collection, toggleSelection } = usePixabayCollectionStore();
  const [loading, setLoading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const handleDownload = async () => {
    setDownloadCount(0);
    setFailedCount(0);
    if (collection.length === 0) {
      toast.warn("No hay imágenes en la colección.", {
        position: "top-right"
      });

      return;
    }

    setLoading(true);

    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));

    for (const hit of collection) {
      const { resData, resError } = await downloadImage(hit.largeImageURL);

      if (resError) {
        toast.error(`Error con ${hit.id}: ${resError}`, {
          position: "top-right",
          autoClose: 5000
        });
        setFailedCount((prev) => prev + 1);
        continue;
      }

      if (resData) {
        await zipWriter.add(`${hit.id}.jpg`, resData.stream()); // ✅ Aquí convertimos Blob a ReadableStream
      }
      setDownloadCount((prev) => prev + 1);
    }

    const zipBlob = await zipWriter.close();
    const zipUrl = URL.createObjectURL(zipBlob);

    // Crear un link para descargar
    const a = document.createElement("a");

    a.href = zipUrl;
    a.download = `pixabay_collection_${collection.length - failedCount}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(zipUrl); // Liberar memoria

    toast.success("Descarga completada", {
      position: "top-right",
      autoClose: 3000
    });
    setLoading(false);
  };

  return (
    <Card shadow="sm">
      <CardBody className="h-[500px] overflow-y-auto flex items-center">
        {collection.length > 0 ? (
          <div className="md:columns-4 sm:columns-3 columns-2 gap-2">
            {collection.map((hit) => (
              <div
                key={hit.id}
                className="break-inside-avoid mb-2 cursor-pointer"
                onDoubleClick={() => toggleSelection(hit)}
              >
                <Image
                  alt={hit.tags}
                  className="object-cover w-full"
                  height={(300 * hit.webformatHeight) / hit.webformatWidth}
                  radius="lg"
                  src={hit.webformatURL}
                  width={300}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 min-h-[470px] flex justify-center items-center">
            No hay imágenes en esta colección
          </div>
        )}
      </CardBody>
      <CardFooter className="flex justify-between items-center gap-4">
        <Progress
          aria-label="Downloading..."
          className={clsx(
            "w-full transition-opacity duration-300 ",
            downloadCount !== 0 ? "opacity-100" : "opacity-0"
          )}
          color="success"
          showValueLabel={true}
          size="md"
          value={Math.ceil((downloadCount * 100) / collection.length)}
        />
        <Button
          className="min-w-fit"
          color="success"
          isLoading={loading}
          startContent={!loading && <FiDownload className="size-4" />}
          onPress={handleDownload}
        >
          Descargar
        </Button>
      </CardFooter>
    </Card>
  );
}
