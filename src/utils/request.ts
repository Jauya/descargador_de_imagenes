export const createRequestOptions = (
  apikey: string,
  name: "freepik" | "pexels"
): RequestInit => {
  if (name === "freepik") {
    return {
      headers: {
        "x-freepik-api-key": apikey,
        "Accept-Language": "es-ES"
      }
    };
  } else {
    return {
      headers: {
        Authorization: apikey
      }
    };
  }
};
