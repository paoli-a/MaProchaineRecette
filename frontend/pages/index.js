import Head from "next/head";
import { Menu } from "../components/MyNextRecipe";
import { FridgeIngredients, FridgeRecipes } from "../components/Fridge";
import { useFridgeRecipes, useFridgeIngredients } from "../hooks/swrFetch";

/**
 * Cette page affiche les ingrédients du frigo et les recettes
 * possibles en fonction de ceux-ci.
 *
 * @component
 */
function MyNextRecipe() {
  const { isfridgeRecipesError } = useFridgeRecipes();
  const { isFridgeIngredientsError } = useFridgeIngredients();
  return (
    <>
      <Head>
        <title>Ma prochaine recette</title>
      </Head>
      <Menu />
      <main className="my-next-recipes">
        {isfridgeRecipesError | isFridgeIngredientsError ? (
          <span>
            "Il y a eu une erreur vis-à-vis du serveur, veuillez recharger la
            page ou réessayer ultérieurement."
          </span>
        ) : (
          ""
        )}
        <FridgeIngredients />
        <FridgeRecipes />
      </main>
    </>
  );
}

export default MyNextRecipe;
