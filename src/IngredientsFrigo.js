import React from 'react';


function IngredientsFrigo ({ingredients}) {

  const ingredientElement = ingredients.map((monIngredient) => {
    const formatedDate = monIngredient.datePeremption.toLocaleDateString()
    return (
      <li key={monIngredient.id}>
        {monIngredient.nom} : {monIngredient.quantite}. Expiration : {formatedDate}.
        <button>Supprimer</button>
      </li>
    )
  })

  return(
    <div>
      <h1> Voici les ingrédients du frigo !</h1>
      <ul>
        {ingredientElement}
      </ul>
      <form>
        <input type="text" placeholder="Ajouter un ingrédient" />
      <button>Confirmer</button>
      </form>
    </div>
  )
}

export default IngredientsFrigo;
