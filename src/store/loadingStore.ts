import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false, // Default state
  setIsLoading: (state: boolean) => set({ isLoading: state }),
}));

export default useLoadingStore;
