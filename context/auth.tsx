import { BASE_URL, TOKEN_KEY_NAME } from "@/constants";
import { tokenCache } from "@/utils/cache";
import {
  DiscoveryDocument,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  type AuthError,
  type AuthRequestConfig,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as jose from "jose";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  provider?: string;
  exp?: number;
  cookieExpiration?: number;
};

const AuthContext = createContext({
  user: null as AuthUser | null,
  signIn: () => {},
  signOut: () => {},
  fetchWithAuth: async (url: string, options?: RequestInit) => Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
});

const config: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [request, response, promptAsync] = useAuthRequest(config, discovery);
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    handleResponse();
  }, [response]);

  const handleResponse = async () => {
    if (response?.type === "success") {
      const { code } = response.params;

      try {
        setIsLoading(true);

        const tokenResponse = await exchangeCodeAsync(
          {
            code,
            extraParams: {
              platform: Platform.OS,
            },
            clientId: "google",
            redirectUri: makeRedirectUri(),
          },
          discovery,
        );

        if (isWeb) {
          const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
            method: "GET",
            credentials: "include",
          });

          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();

            setUser(sessionData as AuthUser);
          }
        } else {
          const accessToken = tokenResponse.accessToken;

          if (!accessToken) {
            console.log("Didn't get an access token");
            return;
          }

          setAccessToken(accessToken);

          tokenCache?.saveToken(TOKEN_KEY_NAME, accessToken);

          console.log(accessToken);

          const decoded = jose.decodeJwt(accessToken);
          setUser(decoded as AuthUser);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else if (response?.type === "error") {
      setError(response.error as AuthError);
    }
  };

  const signIn = async () => {
    try {
      if (!request) {
        console.log("NO_REQUEST");
        return;
      }

      await promptAsync();
    } catch (error) {
      console.error(error);
    }
  };
  const signOut = () => {};
  const fetchWithAuth = async (url: string, options?: RequestInit) => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        fetchWithAuth,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
