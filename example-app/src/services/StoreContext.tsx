import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNAuth } from "nauth-react";
import { fetchMyStore, type StoreInfo } from "./adminApi";

interface StoreContextValue {
  store: StoreInfo | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue>({
  store: null,
  isLoading: true,
  refresh: async () => {},
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useNAuth();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!token) {
      setStore(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const s = await fetchMyStore(token);
      setStore(s);
    } catch {
      setStore(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      refresh();
    } else {
      setStore(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, token, refresh]);

  return (
    <StoreContext.Provider value={{ store, isLoading, refresh }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
