import Head from "next/head";
import PropTypes from "prop-types";
import { Menu } from "../components/MyNextRecipe";
import { CatalogIngredients } from "../components/Catalogs";

/**
 * Cette page affiche le catalogue d'ingrédients possibles.
 *
 * @component
 */
function Ingredients({
  catalogIngredients,
  updateCatalogIngredients,
  fetchError,
}) {
  return (
    <>
      <Head>
        <title>Catalogue des ingrédients</title>
      </Head>
      <Menu />
      <main>
        {fetchError && <span>{fetchError}</span>}
        <CatalogIngredients
          possibleIngredients={catalogIngredients}
          updatePossibleIngredients={updateCatalogIngredients}
        />
      </main>
    </>
  );
}

Ingredients.propTypes = {
  catalogIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  updateCatalogIngredients: PropTypes.func.isRequired,
  fetchError: PropTypes.string,
};

export default Ingredients;
