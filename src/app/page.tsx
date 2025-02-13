"use client";
import CollectionManager from "@/components/CollectionManager";
import ImageGallery from "@/components/image-gallery/ImageGallery";

export default function Home() {
  return (
    <section className="flex w-full">
      <ImageGallery />
      <CollectionManager />
    </section>
  );
}
