import Head from "next/head";
import { Menu } from "../components/MyNextRecipe";
import { CatalogIngredients } from "../components/Catalogs";

export default function Ingredients({
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
