import axios from "axios";
import { API_PATHS } from "../constants/paths";
import {
  useCatalogIngredients,
  useCatalogRecipes,
  useCategories,
  useFridgeIngredients,
  useFridgeRecipes,
  useUnits,
} from "../hooks/swrFetch";
import "../styles/main.scss";

function MyApp({ Component, pageProps, props }: any) {
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

MyApp.getInitialProps = async (context: any) => {
  if (context.ctx.req) {
    let initialFetchError = "";
    const get = async (path: any) => {
      const target =
        process.env.NEXT_PUBLIC_PROXY_HOST || "http://localhost:8000";
      let result: any = { data: [] };
      try {
        result = await axios.get(`${target}${path}`);
      } catch (err) {
        initialFetchError =
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement.";
      }
      return result.data;
    };
    const initialCatalogIngredients = await get(API_PATHS.catalogIngredients);
    const initialCatalogRecipes = await get(API_PATHS.catalogRecipes);
    const initialFridgeIngredients = await get(API_PATHS.fridgeIngredients);
    const initialCatalogCategories = await get(API_PATHS.catalogCategories);
    const initialUnits = await get(API_PATHS.units);
    const initialFridgeRecipes = await get(API_PATHS.fridgeRecipes);
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
