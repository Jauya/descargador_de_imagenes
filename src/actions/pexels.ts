"use server";

import { PexelsData, ServerResponse } from "@/types";
import { createRequestOptions } from "@/utils/request";

const pexelsBaseURL = "https://api.pexels.com/v1/";

interface SearchParamsPexels {
  query: string;
  per_page?: number;
  page?: number;
  orientation?: string;
  color?: string;
  locale?: string;
}

export const searchPhotos = async (
  searchParams: SearchParamsPexels,
  apikey: string
): Promise<ServerResponse<PexelsData>> => {
  try {
    const reqOptions = createRequestOptions(apikey, "pexels");
    const url = new URL(`${pexelsBaseURL}search/`);

    //Establecemos los searchParams
    url.searchParams.append("query", searchParams.query);
    if (searchParams.per_page)
      url.searchParams.append("per_page", searchParams.per_page.toString());
    if (searchParams.page)
      url.searchParams.append("page", searchParams.page.toString());
    if (searchParams.orientation)
      url.searchParams.append("orientation", searchParams.orientation);
    if (searchParams.color)
      url.searchParams.append("color", searchParams.color);
    if (searchParams.locale)
      url.searchParams.append("locale", searchParams.locale);

    const res = await fetch(url, reqOptions);

    if (!res.ok) {
      throw Error(`Error en la API: ${res.status} ${res.statusText}`);
    }
    const resData: PexelsData = await res.json();

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
