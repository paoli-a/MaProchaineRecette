import { useMemo } from "react";

type UseFilterSearchProps<Element> = {
  elementsToFilter: Element[];
  searchResults: string;
  getSearchElement: (element: Element) => string;
};

function useFilterSearch<Element>({
  elementsToFilter,
  searchResults,
  getSearchElement,
}: UseFilterSearchProps<Element>): Element[] {
  return useMemo(() => {
    const filterUtilSearch = function (element: Element) {
      const searchElement = getSearchElement(element).toLowerCase();
      const searchResultsLower = searchResults.toLowerCase();
      const totalLetters = Math.min(searchElement.length, searchResults.length);
      for (let i = 0; i < totalLetters; i++) {
        if (searchElement[i] !== searchResultsLower[i]) {
          return false;
        }
      }
      return true;
    };

    const filterIngredientSearch = function () {
      if (searchResults === "") {
        return elementsToFilter;
      } else {
        return elementsToFilter.filter(filterUtilSearch);
      }
    };

    return filterIngredientSearch();
  }, [elementsToFilter, getSearchElement, searchResults]);
}

export default useFilterSearch;
