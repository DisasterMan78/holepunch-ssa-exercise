import { isValidJson } from "./validation/json-validator";

type Methods = 'POST' | 'GET';

type FetchInit = {
  method: Methods;
  headers: {
    Accept: string;
    'Content-Type': string;
  };
  body?: string;
}

export const FetchApiOnClient = async (apiURL: string, method: Methods, payload?: { [key: string]: any }) => {
  let responseData;
  const fetchInit:FetchInit = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }

  if (method === 'POST') {
    fetchInit.body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(apiURL, fetchInit);

    const body = await response.text();

    if (response.status !== 200 &&  response.status !== 201) {
      return {
        error: response.status,
        errorMessage: response.statusText,
      }
    }

    if (!isValidJson(body)) {
      return ({
        error: 500,
        errorMessage: 'The server responded with malformed JSON',
      })
    }

    responseData = await JSON.parse(body);
  } catch (error) {
    return Promise.reject(error as Error);
  }

  return responseData;
}