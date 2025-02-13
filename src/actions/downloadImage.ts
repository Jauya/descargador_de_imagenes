"use server";

import { ServerResponse } from "@/types";

export const downloadImage = async (
  url: string
): Promise<ServerResponse<Blob>> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message || "No se pudo descargar la imagen";

      throw new Error(errorMessage);
    }

    const blob = await response.blob();

    return { resData: blob, resError: null };
  } catch (error) {
    return {
      resData: null,
      resError: error instanceof Error ? error.message : "Error desconocido"
    };
  }
};
