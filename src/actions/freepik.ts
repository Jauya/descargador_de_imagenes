"use server";

import { FreepikData, FreepikDownloadData, ServerResponse } from "@/types";
import { createRequestOptions } from "@/utils/request";

const freepikBaseURL = "https://api.freepik.com/v1/";

interface SearchParams {
  term: string;
  limit?: number;
  page?: number;
  orientation?: string;
  color?: string;
  image_type?: string;
  order?: string;
  license?: string;
}

export const getAllResources = async (
  searchParams: SearchParams,
  apikey: string
): Promise<ServerResponse<FreepikData>> => {
  try {
    const reqOptions = createRequestOptions(apikey, "freepik");

    const url = new URL(`${freepikBaseURL}resources/`);

    //Establecemos los searchParams
    url.searchParams.append("term", searchParams.term);
    if (searchParams.limit)
      url.searchParams.append("limit", searchParams.limit.toString());
    if (searchParams.page)
      url.searchParams.append("page", searchParams.page.toString());
    if (searchParams.orientation)
      url.searchParams.append(
        `filters[orientation][${searchParams.orientation}]`,
        "1"
      );
    if (searchParams.color)
      url.searchParams.append("filters[color]", searchParams.color);
    if (searchParams.image_type)
      url.searchParams.append(
        `filters[content_type][${searchParams.image_type}]`,
        "1"
      );
    if (searchParams.order)
      url.searchParams.append("order", searchParams.order);
    if (searchParams.license)
      url.searchParams.append(`filters[license][${searchParams.license}]`, "1");

    const res = await fetch(url.toString(), reqOptions);

    if (!res.ok) {
      throw Error(`Error en la API: ${res.status} ${res.statusText}`);
    }
    const resData: FreepikData = await res.json();

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

export const downloadResource = async (
  resourceId: number,
  apikey: string
): Promise<ServerResponse<FreepikDownloadData>> => {
  try {
    const reqOptions = createRequestOptions(apikey, "freepik");

    const res = await fetch(
      `${freepikBaseURL}resources/${resourceId}/download/jpg`,
      reqOptions
    );

    if (!res.ok) {
      throw Error(`Error en la API: ${res.status}`);
    }

    const resData: FreepikDownloadData = await res.json();

    return { resData, resError: null };
  } catch (error) {
    return {
      resData: null,
      resError: error instanceof Error ? error.message : "Error del servidor"
    };
  }
};
