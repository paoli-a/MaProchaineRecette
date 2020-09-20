import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import useFilterSearch from "./useFilterSearch";
import "./CatalogIngredients.css";
import PropTypes from "prop-types";

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
      .post("/catalogs/ingredients/", ingredientToSend)
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
      .delete(`/catalogs/ingredients/${name}/`)
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
        <li key={ingredient.name}>
          {ingredient.name}
          <button onClick={() => handleSupprClick(ingredient.name)}>X</button>
        </li>
        {deleteError.name === ingredient.name && (
          <span>{deleteError.message}</span>
        )}
      </React.Fragment>
    );
  });

  return (
    <main id="ComponentCatalogIngredients">
      <h1>Catalogue de tous mes ingrédients</h1>
      <section id="AddCatalogIngredient">
        <fieldset>
          <legend>Ajouter un ingredient dans le catalogue :</legend>
          <form id="ingredientForm" onSubmit={handleSubmit(onSubmitWrapper)}>
            <p>
              <label htmlFor="ingredientName">
                {" "}
                Nom de l'ingrédient à ajouter :{" "}
              </label>
              <input
                type="text"
                name="ingredientName"
                id="ingredientName"
                defaultValue=""
                ref={register({
                  required: "Ce champ est obligatoire",
                })}
              />
              {errors.ingredientName && (
                <span>{errors.ingredientName.message}</span>
              )}
              {errors.ingredientName && errors.ingredientName.types && (
                <span>{errors.ingredientName.types.message}</span>
              )}
            </p>
            <p>
              <input type="submit" value="Envoyer" />
            </p>
          </form>
        </fieldset>
      </section>
      <section id="CatalogIngredients">
        <form>
          <input
            type="search"
            id="catalogIngredientsSearch"
            value={searchResults}
            placeholder="Recherche..."
            spellCheck="true"
            size="30"
            onChange={handleChangeSearch}
          />
        </form>
        <ul>{ingredientsToDisplay}</ul>
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
