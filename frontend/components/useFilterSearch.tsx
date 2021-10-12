import { useMemo } from "react";

function useFilterSearch({
  elementsToFilter,
  searchResults,
  getSearchElement,
}: any) {
  return useMemo(() => {
    const filterUtilSearch = function (element: any) {
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
