import { RecipeType } from "./types";

type CatalogRecipeResponse = {
  data: RecipeType;
};

function isCatalogRecipeResponse(
  response: unknown
): response is CatalogRecipeResponse {
  function isResponseLike(
    response: unknown
  ): response is CatalogRecipeResponse {
    return (
      response !== null && typeof response === "object" && "data" in response
    );
  }
  return isResponseLike(response) && typeof response.data.id === "string";
}
export { isCatalogRecipeResponse };
