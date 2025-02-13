"use server";

import { PixabayData, ServerResponse } from "@/types";

const pixabayBaseURL = "https://pixabay.com/api/";

interface SearchParamsPixabay {
  q: string;
  per_page?: number;
  page?: number;
  orientation?: string;
  color?: string;
  lang?: string;
  image_type?: string;
  order?: string;
}

export const searchImages = async (
  searchParams: SearchParamsPixabay,
  apikey: string
): Promise<ServerResponse<PixabayData>> => {
  try {
    const url = new URL(pixabayBaseURL);

    //Establecemos los searchParams
    url.searchParams.set("q", searchParams.q);
    url.searchParams.set("key", apikey);
    if (searchParams.per_page)
      url.searchParams.append("per_page", searchParams.per_page.toString());
    if (searchParams.page)
      url.searchParams.append("page", searchParams.page.toString());
    if (searchParams.orientation)
      url.searchParams.append("orientation", searchParams.orientation);
    if (searchParams.color)
      url.searchParams.append("colors", searchParams.color);
    if (searchParams.lang) url.searchParams.append("lang", searchParams.lang);
    if (searchParams.image_type)
      url.searchParams.append("image_type", searchParams.image_type);
    if (searchParams.order)
      url.searchParams.append("order", searchParams.order);

    const res = await fetch(url);

    if (!res.ok) {
      throw Error(`Error en la API: ${res.status} ${res.statusText}`);
    }
    const resData: PixabayData = await res.json();

    return { resData, resError: null };
  } catch (error) {
    /*eslint-disable no-console */
    console.log(error);

    return {
      resData: null,
      resError: error instanceof Error ? error.message : "Error del servidor"
    };
  }
};
