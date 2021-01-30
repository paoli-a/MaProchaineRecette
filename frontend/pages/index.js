import Head from "next/head";
import { Menu } from "../components/MyNextRecipe";
import { FridgeIngredients, FridgeRecipes } from "../components/Fridge";

/**
 * Cette page affiche les ingrédients du frigo et les recettes
 * possibles en fonction de ceux-ci.
 *
 * @component
 */
export default function Home({
  fridgeIngredients,
  updateFridgeIngredients,
  catalogIngredients,
  units,
  feasibleRecipes,
  refetchFeasibleRecipes,
  fetchError,
}) {
  return (
    <>
      <Head>
        <title>Ma prochaine recette</title>
      </Head>
      <Menu />
      <main className="my-next-recipes">
        {fetchError && <span>{fetchError}</span>}
        <FridgeIngredients
          ingredients={fridgeIngredients}
          possibleIngredients={catalogIngredients}
          totalUnits={units}
          feasibleRecipesUpdate={refetchFeasibleRecipes}
          updateFridgeIngredients={updateFridgeIngredients}
        />
        <FridgeRecipes recipes={feasibleRecipes} />
      </main>
    </>
  );
}
