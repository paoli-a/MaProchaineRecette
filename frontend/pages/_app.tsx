import axios from "axios";
import type { AppContext, AppProps } from "next/app";
import { API_PATHS } from "../constants/paths";
import type {
  CatalogIngredientReceived,
  CatalogRecipeReceived,
  FridgeIngredientReceived,
  FridgeRecipeReceived,
} from "../constants/types";
import {
  useCatalogIngredients,
  useCatalogRecipes,
  useCategories,
  useFridgeIngredients,
  useFridgeRecipes,
  useUnits,
} from "../hooks/swrFetch";
import "../styles/main.scss";

interface MyAppPros extends AppProps {
  props: {
    firstTime: boolean;
    initialFetchError: string;
    initialCatalogIngredients: CatalogIngredientReceived[];
    initialCatalogRecipes: CatalogRecipeReceived[];
    initialFridgeIngredients: FridgeIngredientReceived[];
    initialCatalogCategories: string[];
    initialUnits: string[];
    initialFridgeRecipes: FridgeRecipeReceived[];
  };
}

function MyApp({ Component, pageProps, props }: MyAppPros) {
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

MyApp.getInitialProps = async (context: AppContext) => {
  if (context.ctx.req) {
    let initialFetchError = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const get = async <T extends Record<any, any> | string>(
      path: string
    ): Promise<T[]> => {
      const target =
        process.env.NEXT_PUBLIC_PROXY_HOST || "http://localhost:8000";
      let result: { data: T[] } = { data: [] };
      try {
        result = await axios.get(`${target}${path}`);
      } catch (err) {
        initialFetchError =
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement.";
      }
      // TODO: put a type guard here
      return result.data;
    };
    const initialCatalogIngredients = await get<CatalogIngredientReceived>(
      API_PATHS.catalogIngredients
    );
    const initialCatalogRecipes = await get<CatalogRecipeReceived>(
      API_PATHS.catalogRecipes
    );
    const initialFridgeIngredients = await get<FridgeIngredientReceived>(
      API_PATHS.fridgeIngredients
    );
    const initialCatalogCategories = await get<string>(
      API_PATHS.catalogCategories
    );
    const initialUnits = await get<string>(API_PATHS.units);
    const initialFridgeRecipes = await get<FridgeRecipeReceived>(
      API_PATHS.fridgeRecipes
    );
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
