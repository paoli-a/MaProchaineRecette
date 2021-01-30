import Head from "next/head";
import PropTypes from "prop-types";
import { Menu } from "../components/MyNextRecipe";
import { FridgeIngredients, FridgeRecipes } from "../components/Fridge";

/**
 * Cette page affiche les ingrédients du frigo et les recettes
 * possibles en fonction de ceux-ci.
 *
 * @component
 */
function MyNextRecipe({
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

MyNextRecipe.propTypes = {
  catalogIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  fridgeIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      expirationDate: PropTypes.instanceOf(Date),
      amount: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    })
  ).isRequired,
  units: PropTypes.arrayOf(PropTypes.string).isRequired,
  refetchFeasibleRecipes: PropTypes.func.isRequired,
  updateFridgeIngredients: PropTypes.func.isRequired,
  feasibleRecipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired,
      ingredients: PropTypes.arrayOf(
        PropTypes.shape({
          ingredient: PropTypes.string.isRequired,
          amount: PropTypes.string.isRequired,
          unit: PropTypes.string.isRequired,
        }).isRequired
      ),
      duration: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  fetchError: PropTypes.string,
};

export default MyNextRecipe;
