import { FormEvent, useState } from "react";
import { BiKey } from "react-icons/bi";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton"; // Importar Skeleton
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/modal";
import { useQueryState } from "nuqs";

import { providers } from "./SelectProvider";

import { useApikeyStore } from "@/store/apikey";
import { searchPhotos } from "@/actions/pexels";
import { searchImages } from "@/actions/pixabay";
import { getAllResources } from "@/actions/freepik";

export default function ApikeyModal() {
  const [error, setError] = useState("");
  const { setApikey, apikeys } = useApikeyStore();
  const [currentProvider] = useQueryState("provider");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const provider = providers.find(
    (provider) => provider.key === (currentProvider ?? "")
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const currentApikey = data.get("apikey")?.toString() ?? "";
    let resData = null;
    let resError = null;

    switch (currentProvider) {
      case "pexels":
        ({ resData, resError } = await searchPhotos(
          { query: "amazing", per_page: 1 },
          currentApikey
        ));
        break;
      case "pixabay":
        ({ resData, resError } = await searchImages(
          { q: "amazing", per_page: 3 },
          currentApikey
        ));
        break;
      case "freepik":
        ({ resData, resError } = await getAllResources(
          { term: "amazing", limit: 1 },
          currentApikey
        ));
        break;
      default:
        setError("No has elegido proveedor");

        return;
    }

    if (resData == null && resError) {
      setError("Api key invalida.");
    } else {
      setApikey(currentProvider ?? "", currentApikey);
    }
  };

  const onReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    setApikey(currentProvider ?? "", "");
  };

  if (!currentProvider) {
    return <Skeleton className="w-24 h-10 rounded-xl" />;
  }

  return (
    <div>
      <Button
        className="pr-5 gap-1"
        color={!apikeys[currentProvider] ? "default" : "success"}
        startContent={<BiKey className="size-5" />}
        variant="flat"
        onPress={onOpen}
      >
        Clave
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onReset={onReset} onSubmit={onSubmit}>
              <ModalHeader>Validación de Clave</ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  autoComplete="off"
                  defaultValue={apikeys[currentProvider]}
                  disabled={!!apikeys[currentProvider]}
                  errorMessage={error || ""}
                  isInvalid={!!error}
                  name="apikey"
                  placeholder={"Clave de " + provider?.label}
                  startContent={provider?.icon}
                  onChange={() => setError("")}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  isDisabled={!provider || !!error}
                  type={!!apikeys[currentProvider] ? "reset" : "submit"}
                  variant={!!apikeys[currentProvider] ? "flat" : "solid"}
                >
                  {!!apikeys[currentProvider] ? "Resetear" : "Validar"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
