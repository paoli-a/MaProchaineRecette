import Head from "next/head";
import { CatalogRecipes } from "../components/Catalogs";
import { Menu } from "../components/MyNextRecipe";
import { useCatalogRecipes } from "../hooks";

/**
 * Cette page affiche le catalogue de recettes possibles.
 *
 * @component
 */
function Recipes() {
  const { isCatalogRecipesError } = useCatalogRecipes();
  return (
    <>
      <Head>
        <title>Catalogue des recettes</title>
      </Head>
      <Menu />
      <main>
        {isCatalogRecipesError ? (
          <span>
            "Il y a eu une erreur vis-à-vis du serveur, veuillez recharger la
            page ou réessayer ultérieurement."
          </span>
        ) : (
          ""
        )}
        <CatalogRecipes />
      </main>
    </>
  );
}

export default Recipes;
