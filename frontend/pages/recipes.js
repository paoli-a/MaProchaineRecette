import Head from "next/head";
import PropTypes from "prop-types";
import { Menu } from "../components/MyNextRecipe";
import { CatalogRecipes } from "../components/Catalogs";

/**
 * Cette page affiche le catalogue de recettes possibles.
 *
 * @component
 */
function Recipes({
  catalogIngredients,
  catalogRecipes,
  updateCatalogRecipes,
  catalogCategories,
  units,
  refetchFeasibleRecipes,
  fetchError,
}) {
  return (
    <>
      <Head>
        <title>Catalogue des recettes</title>
      </Head>
      <Menu />
      <main>
        {fetchError && <span>{fetchError}</span>}
        <CatalogRecipes
          totalRecipes={catalogRecipes}
          possibleIngredients={catalogIngredients}
          totalCategories={catalogCategories}
          totalUnits={units}
          feasibleRecipesUpdate={refetchFeasibleRecipes}
          updateRecipes={updateCatalogRecipes}
        />
      </main>
    </>
  );
}

Recipes.propTypes = {
  catalogRecipes: PropTypes.arrayOf(
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
  catalogIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  catalogCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  units: PropTypes.arrayOf(PropTypes.string).isRequired,
  refetchFeasibleRecipes: PropTypes.func.isRequired,
  updateCatalogRecipes: PropTypes.func.isRequired,
  fetchError: PropTypes.string,
};

export default Recipes;
