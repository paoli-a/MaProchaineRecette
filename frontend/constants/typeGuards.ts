import { RecipeType } from "./types";

type CatalogRecipeResponse = {
  data: RecipeType;
};

function isCatalogRecipeResponse(
  response: unknown
): response is CatalogRecipeResponse {
  type CatalogRecipeResponseLike = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<any, any>;
  };
  function isResponseLike(
    response: unknown
  ): response is CatalogRecipeResponseLike {
    return (
      typeof response === "object" && response !== null && "data" in response
    );
  }
  return isResponseLike(response) && typeof response.data.id === "string";
}

function isCorrectArrayResponse<ArrayElementType>(
  response: unknown,
  checkDeeper: (arrayElement: ArrayElementType) => boolean
): response is ArrayElementType[] {
  if (!Array.isArray(response)) {
    return false;
  }
  if (
    response.some((element: ArrayElementType) => {
      return !checkDeeper(element);
    })
  ) {
    return false;
  }

  return true;
}

export { isCatalogRecipeResponse, isCorrectArrayResponse };
