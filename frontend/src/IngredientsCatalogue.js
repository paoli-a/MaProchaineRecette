import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import useFilterSearch from "./useFilterSearch";
import "./IngredientsCatalogue.css";
import PropTypes from "prop-types";

function IngredientsCatalogue({
  possibleIngredients,
  updatePossibleIngredients,
}) {
  const { register, handleSubmit, errors, reset, setError } = useForm();
  const [searchResults, setSearchResults] = useState("");
  const [deleteError, setDeleteError] = useState({});

  const onSubmitWrapper = (dataForm) => {
    const ingredientToSend = {
      nom: dataForm.ingredientNom,
    };
    axios
      .post("/catalogues/ingredients/", ingredientToSend)
      .then(({ data }) => {
        const newIngredient = { nom: data.nom };
        const ingredientsListUpdated = possibleIngredients.slice();
        ingredientsListUpdated.push(newIngredient);
        updatePossibleIngredients(ingredientsListUpdated);
        reset();
      })
      .catch(() => {
        setError("ingredientNom", {
          message: "L'ajout a échoué.",
        });
      });
  };

  const handleSupprClick = (nom) => {
    axios
      .delete(`/catalogues/ingredients/${nom}/`)
      .then(() => {
        const ingredientsListUpdated = possibleIngredients.slice();
        const index = ingredientsListUpdated.findIndex((ingredient) => {
          return ingredient.nom === nom;
        });
        ingredientsListUpdated.splice(index, 1);
        updatePossibleIngredients(ingredientsListUpdated);
        setDeleteError({});
      })
      .catch(() => {
        setDeleteError({
          nom: nom,
          message:
            "La suppression a échoué. Veuillez réessayer ultérieurement.",
        });
      });
  };

  const handleChangeSearch = (event) => {
    setSearchResults(event.target.value);
  };

  const ingredientsFiltres = useFilterSearch({
    elementsToFilter: possibleIngredients,
    searchResults: searchResults,
    getSearchElement: (ingredient) => ingredient.nom,
  });

  const ingredient = ingredientsFiltres.map((unIngredient) => {
    return (
      <React.Fragment key={unIngredient.nom}>
        <li key={unIngredient.nom}>
          {unIngredient.nom}
          <button onClick={() => handleSupprClick(unIngredient.nom)}>X</button>
        </li>
        {deleteError.nom === unIngredient.nom && (
          <span>{deleteError.message}</span>
        )}
      </React.Fragment>
    );
  });

  return (
    <main id="ComponentCatalogueIngredients">
      <h1>Catalogue de tous mes ingrédients</h1>
      <section id="AjoutIngredientCatalogue">
        <fieldset>
          <legend>Ajouter un ingredient dans le catalogue :</legend>
          <form id="ingredientForm" onSubmit={handleSubmit(onSubmitWrapper)}>
            <p>
              <label htmlFor="ingredientNom">
                {" "}
                Nom de l'ingrédient à ajouter :{" "}
              </label>
              <input
                type="text"
                name="ingredientNom"
                id="ingredientNom"
                defaultValue=""
                ref={register({
                  required: "Ce champ est obligatoire",
                })}
              />
              {errors.ingredientNom && (
                <span>{errors.ingredientNom.message}</span>
              )}
              {errors.ingredientNom && errors.ingredientNom.types && (
                <span>{errors.ingredientNom.types.message}</span>
              )}
            </p>
            <p>
              <input type="submit" value="Envoyer" />
            </p>
          </form>
        </fieldset>
      </section>
      <section id="CatalogueIngredients">
        <form>
          <input
            type="search"
            id="rechercheCatalogueIngredient"
            name="q"
            value={searchResults}
            placeholder="Recherche..."
            spellCheck="true"
            size="30"
            onChange={handleChangeSearch}
          />
        </form>
        <ul>{ingredient}</ul>
      </section>
    </main>
  );
}

IngredientsCatalogue.propTypes = {
  possibleIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      nom: PropTypes.string.isRequired,
    })
  ).isRequired,
  /**
   * Fonction mettant à jour la propriété controlée possibleIngredients.
   */
  updatePossibleIngredients: PropTypes.func.isRequired,
};

export default IngredientsCatalogue;
