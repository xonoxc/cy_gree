const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL as string
import store from "@/store/token"
import { refreshTokens } from "@/services/token"
import { auth } from "@/services/auth";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

const defaultConfig: FetchOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${store.getState().accessToken}`,
  },
  credentials: "include",
};


export const fetchWithConfig = async (
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> => {
  let config: FetchOptions = {
    ...defaultConfig,
    ...options,
    headers: {
      ...defaultConfig.headers,
      ...options.headers,
      'Authorization': `Bearer ${store.getState().accessToken}`, 
    },
  };

  if (!BASE_URL) {
    throw new Error("Please provide NEXT_PUBLIC_SERVER_URL in .env");
  }

  try {
    const response = await fetch(`${BASE_URL}/api${endpoint}`, config);

    if (response.status === 401) {
			const refreshToken = store.getState().refreshToken
			if(!refreshToken) auth.logout()

            const refreshStatus = await refreshTokens(refreshToken);

			if(refreshStatus){
				
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${store.getState().accessToken}`,
      }

	}else {
				auth.logout()
	}
      return await fetch(`${BASE_URL}/api${endpoint}`, config)
    }

    return response;
  } catch (error) {
    console.error("Fetch request failed:", error)
    throw error
  }
}
