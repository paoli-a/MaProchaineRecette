import Head from "next/head";
import { CatalogIngredients } from "../components/Catalogs";
import { Menu } from "../components/MyNextRecipe";
import { useCatalogIngredients } from "../hooks";

/**
 * Cette page affiche le catalogue d'ingrédients possibles.
 *
 * @component
 */
function Ingredients() {
  const { isCatalogIngredientsError } = useCatalogIngredients();

  return (
    <>
      <Head>
        <title>Catalogue des ingrédients</title>
      </Head>
      <Menu />
      <main>
        {isCatalogIngredientsError ? (
          <span>
            "Il y a eu une erreur vis-à-vis du serveur, veuillez recharger la
            page ou réessayer ultérieurement."
          </span>
        ) : (
          ""
        )}
        <CatalogIngredients />
      </main>
    </>
  );
}

export default Ingredients;
