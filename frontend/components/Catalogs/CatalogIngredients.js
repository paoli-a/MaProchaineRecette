import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import useFilterSearch from "../useFilterSearch";
import { useCatalogIngredients } from "../../hooks/swrFetch";
import { mutate } from "swr";

/**
 * Ce composant permet d'afficher les ingrédients du catalogue, d'en ajouter
 * et d'en supprimer. Une recherche peut etre faite sur le nom des ingrédients et
 * permettra d'afficher au fur et à mesure les ingrédients correspondants.
 *
 * @component
 */
function CatalogIngredients() {
  const { register, handleSubmit, errors, reset, setError } = useForm();
  const [searchResults, setSearchResults] = useState("");
  const [deleteError, setDeleteError] = useState({});
  const { catalogIngredients } = useCatalogIngredients();

  const updatePossibleIngredients = async (ingredientToSend) => {
    const { data } = await axios.post(
      "/api/catalogs/ingredients/",
      ingredientToSend
    );
    const ingredientsListUpdated = catalogIngredients.slice();
    ingredientsListUpdated.push({ name: data.name });
    return ingredientsListUpdated;
  };

  const onSubmitWrapper = async (dataForm) => {
    const ingredientToSend = {
      name: dataForm.ingredientName,
    };
    const ingredientsListUpdated = catalogIngredients.slice();
    ingredientsListUpdated.push(ingredientToSend);
    mutate("/api/catalogs/ingredients/", ingredientsListUpdated, false);
    try {
      await mutate(
        "/api/catalogs/ingredients/",
        updatePossibleIngredients(ingredientToSend)
      );
      reset();
    } catch (error) {
      setError("ingredientName", {
        message: "L'ajout a échoué.",
      });
    }
  };

  const handleSupprClick = (name) => {
    axios
      .delete(`/api/catalogs/ingredients/${name}/`)
      .then(() => {
        const ingredientsListUpdated = catalogIngredients.slice();
        const index = ingredientsListUpdated.findIndex((ingredient) => {
          return ingredient.name === name;
        });
        ingredientsListUpdated.splice(index, 1);
        mutate("/api/catalogs/ingredients/");
        setDeleteError({});
      })
      .catch(() => {
        setDeleteError({
          name: name,
          message:
            "La suppression a échoué. Veuillez réessayer ultérieurement.",
        });
      });
  };

  const handleChangeSearch = (event) => {
    setSearchResults(event.target.value);
  };

  const filteredIngredients = useFilterSearch({
    elementsToFilter: catalogIngredients,
    searchResults: searchResults,
    getSearchElement: (ingredient) => ingredient.name,
  });

  const ingredientsToDisplay = filteredIngredients.map((ingredient) => {
    return (
      <React.Fragment key={ingredient.name}>
        <li className="catalog-ingredients__ingredient" key={ingredient.name}>
          {ingredient.name}
          <button
            className="button"
            onClick={() => handleSupprClick(ingredient.name)}
          >
            X
          </button>
        </li>
        {deleteError.name === ingredient.name && (
          <p className="ingredient__error-message" role="alert">
            {deleteError.message}
          </p>
        )}
      </React.Fragment>
    );
  });

  return (
    <main className="component-catalog-ingredients">
      <h1 className="component-catalog-ingredients__title-h1">
        Catalogue de tous mes ingrédients
      </h1>
      <section className="add-catalog-ingredient">
        <fieldset className="add-catalog-ingredient__form-container">
          <legend>Ajouter un ingredient dans le catalogue :</legend>
          <form className="form" onSubmit={handleSubmit(onSubmitWrapper)}>
            <div className="form__paragraph">
              <label className="form__label" htmlFor="ingredientName">
                {" "}
                Nom de l'ingrédient à ajouter :{" "}
              </label>
              <div className="container-error">
                <input
                  className={
                    errors.ingredientName
                      ? "form__input field-error"
                      : "form__input"
                  }
                  type="text"
                  name="ingredientName"
                  id="ingredientName"
                  defaultValue=""
                  ref={register({
                    required: "Ce champ est obligatoire",
                  })}
                  aria-required="true"
                  aria-invalid={errors.ingredientName ? "true" : "false"}
                />
                {errors.ingredientName && (
                  <p className="form__error-message" role="alert">
                    {errors.ingredientName.message}
                  </p>
                )}
                {errors.ingredientName && errors.ingredientName.types && (
                  <p className="form__error-message" role="alert">
                    {errors.ingredientName.types.message}
                  </p>
                )}
              </div>
            </div>
            <p className="form__paragraph">
              <input
                className="button form__submit"
                type="submit"
                value="Envoyer"
              />
            </p>
          </form>
        </fieldset>
      </section>
      <section className="catalog-ingredients">
        <form className="searchbox">
          <input
            className="searchbox__input"
            type="search"
            value={searchResults}
            placeholder="Recherche..."
            spellCheck="true"
            size="30"
            onChange={handleChangeSearch}
          />
        </form>
        <ul className="catalog-ingredients__ingredients-container">
          {ingredientsToDisplay}
        </ul>
      </section>
    </main>
  );
}

export default CatalogIngredients;
