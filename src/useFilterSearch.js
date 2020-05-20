import { useMemo } from "react";

function useFilterSearch({
  elementsToFilter,
  searchResults,
  getSearchElement,
}) {
  return useMemo(() => {
    const filtreurUtilSearch = function (element) {
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

    const filtreurIngredientSearch = function () {
      if (searchResults === "") {
        return elementsToFilter;
      } else {
        return elementsToFilter.filter(filtreurUtilSearch);
      }
    };

    return filtreurIngredientSearch();
  }, [elementsToFilter, getSearchElement, searchResults]);
}

export default useFilterSearch;
