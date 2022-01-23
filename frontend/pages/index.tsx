import Head from "next/head";
import { FridgeIngredients, FridgeRecipes } from "../components/Fridge";
import { Menu } from "../components/MyNextRecipe";
import { useFridgeIngredients, useFridgeRecipes } from "../hooks/";

/**
 * Cette page affiche les ingrédients du frigo et les recettes
 * possibles en fonction de ceux-ci.
 *
 * @component
 */
function MyNextRecipe() {
  const { isFridgeRecipesError } = useFridgeRecipes();
  const { isFridgeIngredientsError } = useFridgeIngredients();
  return (
    <>
      <Head>
        <title>Ma prochaine recette</title>
      </Head>
      <Menu />
      <main className="my-next-recipes">
        {isFridgeRecipesError || isFridgeIngredientsError ? (
          <span>
            "Il y a eu une erreur vis-à-vis du serveur, veuillez recharger la
            page ou réessayer ultérieurement."
          </span>
        ) : (
          ""
        )}
        <FridgeRecipes />
        <FridgeIngredients />
      </main>
    </>
  );
}

export default MyNextRecipe;
