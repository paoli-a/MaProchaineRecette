import { RecipeType } from "./types";

type CatalogRecipeResponse = {
  data: RecipeType;
};

function isCatalogRecipeResponse(
  response: unknown
): response is CatalogRecipeResponse {
  type CatalogRecipeResponseLike = {
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

export { isCatalogRecipeResponse };
