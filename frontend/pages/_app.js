import axios from "axios";
import "../styles/main.scss";
import {
  useCatalogIngredients,
  useCatalogRecipes,
  useFridgeIngredients,
  useCategories,
  useUnits,
  useFridgeRecipes,
} from "../hooks/swrFetch";

function MyApp({ Component, pageProps, props }) {
  const firstTime = props && props.firstTime;
  useCatalogIngredients(
    firstTime ? props.initialCatalogIngredients : undefined
  );
  useFridgeIngredients(firstTime ? props.initialFridgeIngredients : undefined);
  useCatalogRecipes(firstTime ? props.initialCatalogRecipes : undefined);
  useCategories(firstTime ? props.initialCatalogCategories : undefined);
  useUnits(firstTime ? props.initialUnits : undefined);
  useFridgeRecipes(firstTime ? props.initialFridgeRecipes : undefined);
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (context) => {
  if (context.ctx.req) {
    let initialFetchError = "";
    const get = async (path) => {
      const target =
        process.env.NEXT_PUBLIC_PROXY_HOST || "http://localhost:8000";
      let result = { data: [] };
      try {
        result = await axios.get(`${target}${path}`);
      } catch (err) {
        initialFetchError =
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement.";
      }
      return result.data;
    };
    const initialCatalogIngredients = await get("/api/catalogs/ingredients/");
    const initialCatalogRecipes = await get("/api/catalogs/recipes/");
    const initialFridgeIngredients = await get("/api/fridge/ingredients/");
    const initialCatalogCategories = await get("/api/catalogs/categories/");
    const initialUnits = await get("/api/units/units/");
    const initialFridgeRecipes = await get("/api/fridge/recipes/");
    return {
      props: {
        firstTime: true,
        initialFetchError,
        initialCatalogIngredients,
        initialCatalogRecipes,
        initialFridgeIngredients,
        initialCatalogCategories,
        initialUnits,
        initialFridgeRecipes,
      },
    };
  } else {
    return {
      props: {
        firstTime: false,
      },
    };
  }
};

export default MyApp;
