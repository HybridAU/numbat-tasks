import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useReducer } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {
  type ListDetails,
  addList,
  type addListRequest,
  lists,
} from "../api/lists.ts";

export type ListsProviderState = {
  currentList?: ListDetails;
  lists: ListDetails[];
};

const initialState: ListsProviderState = { lists: [] };

export type ListsAction =
  | { type: "SET_CURRENT_LIST"; payload: ListDetails }
  | { type: "SET_LISTS"; payload: ListDetails[] }
  | { type: "INITIAL_LOAD"; payload: ListsProviderState };

type ListsDispatch = (action: ListsAction) => void;

const ListsContext = createContext<ListsProviderState | undefined>(undefined);
const ListsDispatchContext = createContext<ListsDispatch | undefined>(
  undefined,
);

export function ListsReducer(
  state: ListsProviderState,
  action: ListsAction,
): ListsProviderState {
  switch (action.type) {
    case "SET_CURRENT_LIST": {
      return {
        ...state,
        currentList: action.payload,
      };
    }
    case "SET_LISTS": {
      return {
        ...state,
        lists: action.payload,
      };
    }
    case "INITIAL_LOAD": {
      return {
        ...action.payload,
      };
    }
  }
}

export default function ListsProvider({
  children,
}: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ListsReducer, initialState);
  const authHeader = useAuthHeader();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["Lists"],
    queryFn: () => lists(authHeader),
    enabled: !!authHeader && !state.currentList,
  });

  const { mutate } = useMutation({
    mutationFn: (data: addListRequest) => addList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Lists"] });
    },
  });

  useEffect(() => {
    if (data?.length === 0) {
      mutate({ name: "Default List", authHeader: authHeader });
    } else if (data) {
      dispatch({
        type: "INITIAL_LOAD",
        payload: { currentList: data[0], lists: data },
      });
    }
  }, [data, mutate, authHeader]);

  return (
    <ListsContext.Provider value={state}>
      <ListsDispatchContext.Provider value={dispatch}>
        {children}
      </ListsDispatchContext.Provider>
    </ListsContext.Provider>
  );
}

export function useListsState() {
  const context = useContext(ListsContext);
  if (context === undefined)
    throw new Error("useListsState must be used within a ListsContext");

  return context;
}

export function useListsDispatch() {
  const context = useContext(ListsDispatchContext);
  if (context === undefined)
    throw new Error("useListsDispatch must be used within a ListsContext");

  return context;
}
