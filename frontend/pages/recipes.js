import Head from "next/head";
import { Menu } from "../components/MyNextRecipe";
import { CatalogRecipes } from "../components/Catalogs";

export default function Recipes({
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
