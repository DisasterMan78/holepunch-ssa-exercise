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

    if (response.status !== 200) {
      return {
        error: response.status,
        errorMessage: response.statusText,
      }
    }

    responseData = await response.json();
  } catch (error) {
    return Promise.reject(error as Error);
  }

  return responseData;
}