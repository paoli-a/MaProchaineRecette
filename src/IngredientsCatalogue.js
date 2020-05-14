import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useFilterSearch from "./useFilterSearch"

function IngredientsCatalogue ({ingredientsPossibles}) {

  const { register, handleSubmit, errors, reset} = useForm()
  const [ingredientsCatalogue, setIngredientsCatalogue] = useState(ingredientsPossibles);
  const [searchResults, setSearchResults] = useState("")

  const onSubmitWrapper = (data) => {
    const id = new Date().getTime();
    const ingredientNouveau = {id : id, nom : data.ingredientNom};
    const ingredientsListUpdated = ingredientsCatalogue.slice();
    ingredientsListUpdated.push(ingredientNouveau);
    setIngredientsCatalogue(ingredientsListUpdated)
    reset()
  }

  const handleSupprClick = (id) => {
    const ingredientsListUpdated = ingredientsCatalogue.slice()
    const index = ingredientsListUpdated.findIndex((ingredient) => {
      return ingredient.id === id
    });
    ingredientsListUpdated.splice(index,1);
    setIngredientsCatalogue(ingredientsListUpdated)
  }

  const handleChangeSearch = (event) => {
    setSearchResults(event.target.value)
  }

  const ingredientsFiltres = useFilterSearch({
    elementsToFilter: ingredientsCatalogue,
    searchResults:searchResults,
    getSearchElement: (ingredient) => ingredient.nom
  })

  const ingredient = ingredientsFiltres.map(
    (unIngredient) => {
      return (
        <li key={unIngredient.id}>
          {unIngredient.nom}
          <button onClick={() => handleSupprClick(unIngredient.id)}>X</button>
        </li>)
    })

  return(
    <div>
      <h1> Catalogue des ingrédients</h1>
      <form>
        <input type="search" id="rechercheCatalogueIngredient" name="q" value={searchResults}
        placeholder="Recherche..." spellCheck="true" size="30" onChange={handleChangeSearch} />
      </form>
      <form id="ingredientForm" onSubmit={handleSubmit(onSubmitWrapper)} >
        <fieldset>
        <legend>Ajouter un ingredient dans le catalogue</legend>
          <label htmlFor="ingredientNom"> Nom de l'ingrédient à ajouter : </label>
          <input type="text" name="ingredientNom" id="ingredientNom" defaultValue=""
          ref={register({ required: true })}/>
          {errors.ingredientNom && <span>Ce champ est obligatoire</span>}
          <input type="submit" value="Envoyer"/>
        </fieldset>
      </form>
      <ul>
        {ingredient}
      </ul>
    </div>
  )
}

export default IngredientsCatalogue;
