import useLoadingStore from "../store/loadingStore";

export default function useLoading(value: boolean) {
  useLoadingStore.getState().setIsLoading(value);
}
