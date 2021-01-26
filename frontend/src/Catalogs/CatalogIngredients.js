import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import useFilterSearch from "../useFilterSearch";
import PropTypes from "prop-types";

/**
 * Ce composant permet d'afficher les ingrédients du catalogue, d'en ajouter
 * et d'en supprimer. Une recherche peut etre faite sur le nom des ingrédients et
 * permettra d'afficher au fur et à mesure les ingrédients correspondants.
 *
 * @component
 */
function CatalogIngredients({
  possibleIngredients,
  updatePossibleIngredients,
}) {
  const { register, handleSubmit, errors, reset, setError } = useForm();
  const [searchResults, setSearchResults] = useState("");
  const [deleteError, setDeleteError] = useState({});

  const onSubmitWrapper = (dataForm) => {
    const ingredientToSend = {
      name: dataForm.ingredientName,
    };
    axios
      .post("/api/catalogs/ingredients/", ingredientToSend)
      .then(({ data }) => {
        const newIngredient = { name: data.name };
        const ingredientsListUpdated = possibleIngredients.slice();
        ingredientsListUpdated.push(newIngredient);
        updatePossibleIngredients(ingredientsListUpdated);
        reset();
      })
      .catch(() => {
        setError("ingredientName", {
          message: "L'ajout a échoué.",
        });
      });
  };

  const handleSupprClick = (name) => {
    axios
      .delete(`/api/catalogs/ingredients/${name}/`)
      .then(() => {
        const ingredientsListUpdated = possibleIngredients.slice();
        const index = ingredientsListUpdated.findIndex((ingredient) => {
          return ingredient.name === name;
        });
        ingredientsListUpdated.splice(index, 1);
        updatePossibleIngredients(ingredientsListUpdated);
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
    elementsToFilter: possibleIngredients,
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
            <p className="form__paragraph">
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
            </p>
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

CatalogIngredients.propTypes = {
  possibleIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  /**
   * Fonction mettant à jour la propriété controlée possibleIngredients.
   */
  updatePossibleIngredients: PropTypes.func.isRequired,
};

export default CatalogIngredients;
