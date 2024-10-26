const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL as  string
import store  from "@/store/token"

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const defaultConfig: FetchOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
	'Authorization': `Bearer ${store.getState().accessToken}`
  },
  credentials: "include",
};

export const fetchWithConfig = async (endpoint: string, options: FetchOptions = {}):Promise<Response> => {
  const config: FetchOptions = {
    ...defaultConfig,
    ...options,
    headers: {
      ...defaultConfig.headers,
      ...options.headers,
    },
  };

  if(!BASE_URL) {
    throw new Error("Please provide NEXT_PUBLIC_SERVER_URL in .env ")
  }

  return await fetch(`${BASE_URL}/api${endpoint}`, config)
}


