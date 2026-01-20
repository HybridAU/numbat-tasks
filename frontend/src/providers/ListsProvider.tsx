import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  use,
  useEffect,
  useReducer,
} from "react";
import {
  addList,
  type addListRequest,
  type ListDetails,
  lists,
} from "../api/lists";

export type ListsProviderState = {
  listsLoaded: boolean;
  currentList: ListDetails;
  lists: ListDetails[];
  newListId?: number;
};

const initialState: ListsProviderState = {
  listsLoaded: false,
  currentList: {
    id: 1,
    name: "Default List",
    pinned: false,
    archived: false,
    created: "",
    updated: "",
    sort_order: "created",
    manual_order: [],
  },
  lists: [],
};

export type ListsAction =
  | { type: "SET_CURRENT_LIST"; payload: ListDetails }
  | { type: "SET_CURRENT_LIST_BY_ID"; payload: number }
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
      localStorage.setItem("listId", action.payload.id.toString());
      return {
        ...state,
        currentList: action.payload,
      };
    }
    case "SET_CURRENT_LIST_BY_ID": {
      // TODO This feels loopy and I'm sure it's there is a better way to do this.
      //  I originally just set the current list here, but that wasn't working because Lists query
      //  had been marked as invalidated but hadn't finished refreshing yet when this is called,
      //  so what we do here is save the id we are looking for to the state, then next time the
      //  Lists query (data) is updated, we use the newListId if it exists.
      //  The joy of working with asynchronous code.
      localStorage.setItem("listId", action.payload.toString());
      return {
        ...state,
        newListId: action.payload,
      };
    }
    case "SET_LISTS": {
      // Use the "newListId" if it exists, otherwise keep the current list,
      // and if that's been deleted just take the first list in the array
      const newCurrentList =
        action.payload.find((obj) => obj.id === state.newListId) ||
        action.payload.find((obj) => obj.id === state.currentList.id) ||
        action.payload[0];
      return {
        ...state,
        currentList: newCurrentList,
        lists: action.payload,
        newListId: undefined,
      };
    }
    case "INITIAL_LOAD": {
      return {
        ...action.payload,
      };
    }
  }
}

export default function ListsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ListsReducer, initialState);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["Lists"],
    queryFn: () => lists({}),
  });

  const { mutate } = useMutation({
    mutationFn: (data: addListRequest) => addList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Lists"] });
    },
  });

  useEffect(() => {
    if (data?.length === 0) {
      mutate({ name: "Default List" });
    } else if (data && !state.listsLoaded) {
      // Check if the previously loaded listId is in local storage, and if so use it.
      const listId = localStorage.getItem("listId");
      const previousList = data.find((list) => list.id === Number(listId));
      dispatch({
        type: "INITIAL_LOAD",
        payload: {
          listsLoaded: true,
          currentList: previousList || data[0],
          lists: data,
        },
      });
    } else if (data && state.listsLoaded) {
      dispatch({
        type: "SET_LISTS",
        payload: data,
      });
    }
  }, [data, mutate, state.listsLoaded]);

  return (
    <ListsContext.Provider value={state}>
      <ListsDispatchContext.Provider value={dispatch}>
        {children}
      </ListsDispatchContext.Provider>
    </ListsContext.Provider>
  );
}

export function useListsState() {
  const context = use(ListsContext);
  if (context === undefined)
    throw new Error("useListsState must be used within a ListsContext");

  return context;
}

export function useListsDispatch() {
  const context = use(ListsDispatchContext);
  if (context === undefined)
    throw new Error("useListsDispatch must be used within a ListsContext");

  return context;
}
