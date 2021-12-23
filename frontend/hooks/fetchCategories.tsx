import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";
import { isCorrectArrayResponse } from "../constants/typeGuards";

type UseCategories = {
  categories: string[];
  isCategoriesLoading: boolean;
  isCategoriesError: boolean;
};

function fetcherArrayOfStrings(url: string): Promise<string[]> {
  return axios.get(url).then((res): string[] => {
    if (isCorrectArrayResponse(res.data, (element: string) => true)) {
      return res.data;
    } else {
      return [];
    }
  });
}

function useCategories(fallbackData?: string[]): UseCategories {
  const { data, error } = useSWR<string[], AxiosError<Error>>(
    API_PATHS.catalogCategories,
    fetcherArrayOfStrings,
    {
      fallbackData: fallbackData,
    }
  );
  const categories = data ? data : [];
  return {
    categories: categories,
    isCategoriesLoading: !error && !data,
    isCategoriesError: Boolean(error),
  };
}

export { useCategories, fetcherArrayOfStrings };
