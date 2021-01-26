import { useState } from "react";
import axios from "axios";
import "../styles/main.scss";

function MyApp({ Component, pageProps, props }) {
  const [catalogIngredients, setCatalogIngredients] = useState(
    props && props.firstTime ? props.initialCatalogIngredients : []
  );
  const [fridgeIngredients, setFridgeIngredients] = useState(() => {
    if (props && props.firstTime) {
      return props.initialFridgeIngredients.map((fridgeIngredient) => {
        return {
          id: fridgeIngredient.id,
          name: fridgeIngredient.ingredient,
          expirationDate: new Date(fridgeIngredient.expiration_date),
          amount: fridgeIngredient.amount,
          unit: fridgeIngredient.unit,
        };
      });
    } else {
      return [];
    }
  });
  const [catalogRecipes, setCatalogRecipes] = useState(
    props && props.firstTime ? props.initialCatalogRecipes : []
  );
  const [catalogCategories] = useState(
    props && props.firstTime ? props.initialCatalogCategories : []
  );
  const [units] = useState(props && props.firstTime ? props.initialUnits : []);
  const [feasibleRecipes, setFeasibleRecipes] = useState(
    props && props.firstTime ? props.initialFeasibleRecipes : []
  );
  const [fetchError, setFetchError] = useState(
    props && props.firstTime ? props.initialFetchError : ""
  );

  const refetchFeasibleRecipes = () => {
    axios
      .get("/api/fridge/recipes/")
      .then(({ data }) => {
        setFeasibleRecipes(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
  };

  return (
    <Component
      {...pageProps}
      catalogIngredients={catalogIngredients}
      updateCatalogIngredients={setCatalogIngredients}
      fridgeIngredients={fridgeIngredients}
      updateFridgeIngredients={setFridgeIngredients}
      catalogRecipes={catalogRecipes}
      updateCatalogRecipes={setCatalogRecipes}
      catalogCategories={catalogCategories}
      units={units}
      feasibleRecipes={feasibleRecipes}
      fetchError={fetchError}
      refetchFeasibleRecipes={refetchFeasibleRecipes}
    />
  );
}

MyApp.getInitialProps = async (context) => {
  if (context.ctx.req) {
    let initialFetchError = "";
    const get = async (path) => {
      const target =
        process.env.REACT_APP_PROXY_HOST || "http://localhost:8000";
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
    const initialFeasibleRecipes = await get("/api/fridge/recipes/");
    return {
      props: {
        firstTime: true,
        initialFetchError,
        initialCatalogIngredients,
        initialCatalogRecipes,
        initialFridgeIngredients,
        initialCatalogCategories,
        initialUnits,
        initialFeasibleRecipes,
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
