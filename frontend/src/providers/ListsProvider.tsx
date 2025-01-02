import { createContext, useContext, useReducer } from "react";
import type { ListDetails } from "../api/getLists.ts";

export type ListsProviderState = {
  currentListId: number;
  lists: ListDetails[];
};

const initialState: ListsProviderState = { currentListId: 1, lists: [] };

export type ListsAction =
  | { type: "SET_CURRENT_LIST_ID"; payload: number }
  | { type: "SET_LISTS"; payload: ListDetails[] };

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
    case "SET_CURRENT_LIST_ID": {
      return {
        ...state,
        currentListId: action.payload,
      };
    }
    case "SET_LISTS": {
      return {
        ...state,
        lists: action.payload,
      };
    }
  }
}

export default function ListsProvider({
  children,
}: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ListsReducer, initialState);
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
