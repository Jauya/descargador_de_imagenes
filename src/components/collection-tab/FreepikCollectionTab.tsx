import { useQueryState } from "nuqs";
import clsx from "clsx";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Image } from "@heroui/image";
import { BlobWriter, ZipWriter } from "@zip.js/zip.js";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";

import { downloadResource } from "@/actions/freepik";
import { useApikeyStore } from "@/store/apikey";
import { downloadImage } from "@/actions/downloadImage";
import { useFreepikCollectionStore } from "@/store/collections";

export default function FreepikCollectionTab() {
  const [provider] = useQueryState("provider");
  const { apikeys } = useApikeyStore();

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
    resetFailedCount,
    completeDownloadCount
  } = useFreepikCollectionStore();

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

    for (const resource of collection) {
      // 🔹 Obtener la URL de descarga desde Freepik
      const { resData, resError } = await downloadResource(
        resource.id,
        apikeys[provider ?? ""]
      );

      if (resError || !resData?.data?.[0]) {
        if (resError?.slice(-3) === "429") {
          toast.error("Has alcanzado el límite de uso de la prueba gratuita", {
            position: "top-right",
            autoClose: 5000
          });
          completeDownloadCount();
          setLoading(false);

          return;
        }
        toast.error(
          `Error con ${resource.id}: ${resError ?? "No se pudo obtener la URL"}`,
          {
            position: "top-right",
            autoClose: 5000
          }
        );
        incrementFailedCount();
        continue;
      }

      const { url, filename } = resData.data[0];

      // 🔹 Descargar la imagen desde la URL obtenida
      const { resData: blobData, resError: blobError } =
        await downloadImage(url);

      if (blobError || !blobData) {
        toast.error(`Error al descargar ${resource.id}: ${blobError}`, {
          position: "top-right",
          autoClose: 5000
        });
        incrementFailedCount();
        continue;
      }

      // 🔹 Agregar la imagen al ZIP
      await zipWriter.add(filename ?? `${resource.id}.jpg`, blobData.stream());

      incrementDownloadCount();
    }

    const zipBlob = await zipWriter.close();
    const zipUrl = URL.createObjectURL(zipBlob);

    // 🔹 Crear el link de descarga
    const a = document.createElement("a");

    a.href = zipUrl;
    a.download = `freepik_collection_${collection.length - failedCount}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(zipUrl); // Liberar memoria

    toast.success("Descarga completada ✅", {
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
            {collection.map((resource) => {
              const [widthStr, heightStr] =
                resource.image.source.size.split("x");
              const width = 360;
              const height =
                (width * parseInt(heightStr, 10)) / parseInt(widthStr, 10);

              return (
                <div
                  key={resource.id}
                  className="break-inside-avoid mb-2 cursor-pointer"
                  onDoubleClick={() => {
                    if (!loading) toggleSelection(resource);
                  }}
                >
                  <Image
                    alt={resource.title}
                    className="object-cover w-full"
                    height={height}
                    radius="lg"
                    src={resource.image.source.url}
                    width={width}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 min-h-[470px] flex justify-center items-center">
            No hay imágenes en esta colección
          </div>
        )}
      </CardBody>
      <CardFooter className="flex justify-between items-center gap-4">
        <Progress
          aria-label="Descargando imágenes..."
          className={clsx(
            "w-full transition-opacity duration-300",
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
