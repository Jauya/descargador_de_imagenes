import { Suspense, useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { Alert } from "@heroui/alert";

import PexelsImages from "./PexelsImages";
import PixabayImages from "./PixabayImages";
import FreepikImages from "./FreepikImages";

import { useApikeyStore } from "@/store/apikey";

export default function ImageGallery() {
  const [error, setError] = useState("");
  const { apikeys } = useApikeyStore();
  const [currentProvider] = useQueryState("provider");

  useEffect(() => {
    if (currentProvider) {
      if (!!apikeys[currentProvider]) {
        setError("");
      } else {
        setError("Ingresa tu clave para empezar");
      }
    } else {
      setError("Seleccione un Proveedor para empezar");
    }
  }, [apikeys[currentProvider ?? ""]]);

  const renderGallery = () => {
    switch (currentProvider) {
      case "pexels":
        return <PexelsImages />;
      case "pixabay":
        return <PixabayImages />;
      case "freepik":
        return <FreepikImages />;
      default:
        return (
          <div className="flex justify-center w-full p-2">
            <Alert title="Seleccione un Proveedor para empezar" />
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {error ? (
        <div className="flex justify-center w-full p-2">
          <Alert title={error} />
        </div>
      ) : (
        <Suspense>{renderGallery()}</Suspense>
      )}
    </div>
  );
}
