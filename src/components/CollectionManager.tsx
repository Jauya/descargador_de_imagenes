import { useState } from "react";
import { BsImages } from "react-icons/bs";
import { SiFreepik, SiPexels, SiPixabay } from "react-icons/si";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure
} from "@heroui/modal";
import { Tab, Tabs } from "@heroui/tabs";

import PexelsCollectionTab from "./collection-tab/PexelsCollectionTab";
import PixabayCollectionTab from "./collection-tab/PixabayCollectionTab";
import FreepikCollectionTab from "./collection-tab/FreepikCollectionTab";

export default function CollectionManager() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState("pexels");

  return (
    <div className="fixed z-30 bottom-8 left-8 ">
      <Button
        className="bg-neutral-800/90 text-neutral-50 backdrop-blur-sm shadow-neutral-950/30"
        startContent={<BsImages className="size-6" />}
        variant="shadow"
        onPress={onOpen}
      >
        Colecciones
      </Button>
      <Modal
        backdrop="transparent"
        isOpen={isOpen}
        shadow="lg"
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader>Colecciones</ModalHeader>
          <ModalBody className="mb-2">
            <Tabs
              aria-label="collection-options"
              selectedKey={selected}
              onSelectionChange={(e) => setSelected(e.toString())}
            >
              <Tab
                key="pexels"
                title={
                  <div className="flex items-center space-x-2">
                    <SiPexels className="size-5" />
                    <span>Pexels</span>
                  </div>
                }
              >
                <PexelsCollectionTab />
              </Tab>
              <Tab
                key="pixabay"
                title={
                  <div className="flex items-center space-x-2">
                    <SiPixabay className="size-5" />
                    <span>Pixabay</span>
                  </div>
                }
              >
                <PixabayCollectionTab />
              </Tab>
              <Tab
                key="freepik"
                title={
                  <div className="flex items-center space-x-2">
                    <SiFreepik className="size-5" />
                    <span>Freepik</span>
                  </div>
                }
              >
                <FreepikCollectionTab />
              </Tab>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
