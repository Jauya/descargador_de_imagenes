import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import { BlobWriter, ZipWriter } from "@zip.js/zip.js";
import { Progress } from "@heroui/progress";
import clsx from "clsx";

import { usePexelsCollectionStore } from "@/store/collections";
import { downloadImage } from "@/actions/downloadImage";

export default function PexelsCollectionTab() {
  const {
    collection,
    toggleSelection,
    loading,
    setLoading,
    downloadCount,
    incrementDownloadCount,
    resetDownloadCount,
    failedCount,
    incrementFailedCount,
    resetFailedCount
  } = usePexelsCollectionStore();

  const handleDownload = async () => {
    resetDownloadCount();
    resetFailedCount();
    if (collection.length === 0) {
      toast.warn("No hay imágenes en la colección.", {
        position: "top-right"
      });

      return;
    }

    setLoading(true);

    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));

    for (const photo of collection) {
      const { resData, resError } = await downloadImage(photo.src.original);

      if (resError) {
        toast.error(`Error con ${photo.id}: ${resError}`, {
          position: "top-right",
          autoClose: 5000
        });
        incrementFailedCount();
        continue;
      }

      if (resData) {
        await zipWriter.add(`${photo.id}.jpg`, resData.stream()); // ✅ Aquí convertimos Blob a ReadableStream
      }
      incrementDownloadCount();
    }

    const zipBlob = await zipWriter.close();
    const zipUrl = URL.createObjectURL(zipBlob);

    // Crear un link para descargar
    const a = document.createElement("a");

    a.href = zipUrl;
    a.download = `pexels_collection_${collection.length - failedCount}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(zipUrl); // Liberar memoria

    toast.success("Descarga completada", {
      position: "top-right",
      autoClose: 3000
    });

    setTimeout(() => {
      resetDownloadCount();
      resetFailedCount();
    }, 5000);
    setLoading(false);
  };

  return (
    <Card shadow="sm">
      <CardBody className="h-[500px] overflow-y-auto flex items-center">
        {collection.length > 0 ? (
          <div className="md:columns-4 sm:columns-3 columns-2 gap-2">
            {collection.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid mb-2 cursor-pointer"
                onDoubleClick={() => {
                  if (!loading) toggleSelection(photo);
                }}
              >
                <Image
                  alt={photo.alt}
                  className="object-cover w-full"
                  height={(225 * photo.height) / photo.width}
                  radius="lg"
                  src={photo.src.medium}
                  width={225}
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
