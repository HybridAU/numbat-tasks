import {
  type ReactNode,
  createContext,
  use,
  useEffect,
  useReducer,
} from "react";

export type AuthenticationProviderState = {
  accessToken?: string;
  refreshToken?: string;
  authHeader?: string;
};

const initialState: AuthenticationProviderState = {};

export type AuthenticationAction =
  | {
      type: "SET_LOGGED_IN";
      payload: { accessToken: string; refreshToken: string };
    }
  | { type: "SET_LOGGED_OUT"; payload: null };

type AuthenticationDispatch = (action: AuthenticationAction) => void;

const AuthenticationContext = createContext<
  AuthenticationProviderState | undefined
>(undefined);
const AuthenticationDispatchContext = createContext<
  AuthenticationDispatch | undefined
>(undefined);

export function AuthenticationReducer(
  state: AuthenticationProviderState,
  action: AuthenticationAction,
): AuthenticationProviderState {
  switch (action.type) {
    case "SET_LOGGED_IN": {
      return {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        authHeader: `Bearer ${action.payload.accessToken}`,
      };
    }
    case "SET_LOGGED_OUT": {
      return { accessToken: undefined, refreshToken: undefined };
    }
    default: {
      return { ...state };
    }
  }
}

export default function AuthenticationProvider({
  children,
}: { children: ReactNode }) {
  const [state, dispatch] = useReducer(AuthenticationReducer, initialState);
  useEffect(() => {
    if (state.accessToken === undefined) {
      // Because the AuthenticationProvider comes before the RouterProvider we can't use useNavigation here
      const path = window.location.pathname;
      if (!path.includes("sign-in")) {
        window.location.href = "/sign-in";
      }
    }
  }, [state.accessToken]);
  return (
    <AuthenticationContext.Provider value={state}>
      <AuthenticationDispatchContext value={dispatch}>
        {children}
      </AuthenticationDispatchContext>
    </AuthenticationContext.Provider>
  );
}

export function useAuthenticationsState() {
  const context = use(AuthenticationContext);
  if (context === undefined)
    throw new Error(
      "useAuthenticationsState must be used within a AuthenticationsContext",
    );

  return context;
}

export function useAuthenticationsDispatch() {
  const context = use(AuthenticationDispatchContext);
  if (context === undefined)
    throw new Error(
      "useAuthenticationsDispatch must be used within a AuthenticationsContext",
    );

  return context;
}
