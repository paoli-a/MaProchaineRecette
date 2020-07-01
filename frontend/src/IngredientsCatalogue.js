import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useFilterSearch from "./useFilterSearch";
import "./IngredientsCatalogue.css";
import PropTypes from "prop-types";

function IngredientsCatalogue({
  ingredientsPossibles,
  updateIngredientsPossibles,
}) {
  const { register, handleSubmit, errors, reset } = useForm();
  const [searchResults, setSearchResults] = useState("");

  const onSubmitWrapper = (data) => {
    const id = new Date().getTime();
    const ingredientNouveau = { id: id, nom: data.ingredientNom };
    const ingredientsListUpdated = ingredientsPossibles.slice();
    ingredientsListUpdated.push(ingredientNouveau);
    updateIngredientsPossibles(ingredientsListUpdated);
    reset();
  };

  const handleSupprClick = (id) => {
    const ingredientsListUpdated = ingredientsPossibles.slice();
    const index = ingredientsListUpdated.findIndex((ingredient) => {
      return ingredient.id === id;
    });
    ingredientsListUpdated.splice(index, 1);
    updateIngredientsPossibles(ingredientsListUpdated);
  };

  const handleChangeSearch = (event) => {
    setSearchResults(event.target.value);
  };

  const ingredientsFiltres = useFilterSearch({
    elementsToFilter: ingredientsPossibles,
    searchResults: searchResults,
    getSearchElement: (ingredient) => ingredient.nom,
  });

  const ingredient = ingredientsFiltres.map((unIngredient) => {
    return (
      <li key={unIngredient.id}>
        {unIngredient.nom}
        <button onClick={() => handleSupprClick(unIngredient.id)}>X</button>
      </li>
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
                ref={register({ required: true })}
              />
              {errors.ingredientNom && <span>Ce champ est obligatoire</span>}
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
  ingredientsPossibles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nom: PropTypes.string.isRequired,
    })
  ).isRequired,
  /**
   * Fonction mettant à jour la propriété controlée ingredientsPossibles.
   */
  updateIngredientsPossibles: PropTypes.func.isRequired,
};

export default IngredientsCatalogue;
