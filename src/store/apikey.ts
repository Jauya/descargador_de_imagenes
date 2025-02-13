import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ApikeyStore {
  apikeys: Record<string, string>;
  setApikey: (provider: string, apikey: string) => void;
}

export const useApikeyStore = create<ApikeyStore>()(
  persist(
    (set) => ({
      apikeys: {
        pexels: "",
        pixabay: "",
        freepik: ""
      },
      setApikey: (provider, apikey) =>
        set((state) => ({
          apikeys: { ...state.apikeys, [provider]: apikey }
        }))
    }),
    {
      name: "apikey-store",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
