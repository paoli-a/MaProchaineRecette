import { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";
import { fetcherArrayOfStrings } from "./fetchCategories";

type UseUnits = {
  units: string[];
  isUnitsLoading: boolean;
  isUnitsError: boolean;
};

function useUnits(fallbackData?: string[]): UseUnits {
  const { data, error } = useSWR<string[], AxiosError<Error>>(
    API_PATHS.units,
    fetcherArrayOfStrings,
    {
      fallbackData: fallbackData,
    }
  );
  const units = data ? data : [];
  return {
    units: units,
    isUnitsLoading: !error && !data,
    isUnitsError: Boolean(error),
  };
}

export { useUnits };
