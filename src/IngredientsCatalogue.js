import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useFilterSearch from "./useFilterSearch";

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
    <div>
      <h1>Catalogue de tous mes ingrédients</h1>
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
      <form id="ingredientForm" onSubmit={handleSubmit(onSubmitWrapper)}>
        <fieldset>
          <legend>Ajouter un ingredient dans le catalogue</legend>
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
          <input type="submit" value="Envoyer" />
        </fieldset>
      </form>
      <ul>{ingredient}</ul>
    </div>
  );
}

export default IngredientsCatalogue;
