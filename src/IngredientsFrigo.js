import React, {useState} from 'react';


function IngredientsFrigo ({ingredients}) {

  const [ingredientsList, setIngredient] = useState(ingredients);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantite, setIngredientQuantite] = useState("");
  const [quantiteUnite, setQuantiteUnité] = useState("g");
  const [ingredientPeremption, setIngredientPeremption] = useState("");


  const handleSupprClick = (id) => {
    supprIngredient(id);
  }

  const supprIngredient = (id) => {
    const ingredientsListUpdated = ingredientsList.slice()
    const index = ingredientsListUpdated.findIndex((ingredient) => {
      return ingredient.id === id
    });
    ingredientsListUpdated.splice(index,1);
    setIngredient(ingredientsListUpdated)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const id = new Date().getTime();
    const quantite = ingredientQuantite + quantiteUnite;
    const datePeremption = new Date(ingredientPeremption);

    const ingredientNouveau = {id : id, nom : ingredientName,
      datePeremption : datePeremption, quantite : quantite};

    const ingredientsListUpdated = ingredientsList.slice();
    ingredientsListUpdated.push(ingredientNouveau);
    setIngredient(ingredientsListUpdated)
  }

  const handleChangeName = (event) => {
    const valueName = event.currentTarget.value;
    setIngredientName(valueName)
  }

  const handleChangeQuantite = (event) => {
    const valueQuantite = event.currentTarget.value;
    setIngredientQuantite(valueQuantite)
  }

  const handleChangePeremption = (event) => {
    const valuePeremption = event.currentTarget.value;
    setIngredientPeremption(valuePeremption)
  }

  const handleChangeUnite = (event) => {
    const valueUnite = event.currentTarget.value;
    setQuantiteUnité(valueUnite)
  }

  const ingredientElement = ingredientsList.map((monIngredient) => {
    const formatedDate = monIngredient.datePeremption.toLocaleDateString()
    return (
      <li key={monIngredient.id}>
        {monIngredient.nom} : {monIngredient.quantite}. Expiration : {formatedDate}.
        <button onClick={() => handleSupprClick(monIngredient.id)}>Supprimer</button>
      </li>
    )
  })

  return(
    <div>
      <h1> Voici les ingrédients du frigo !</h1>
      <form onSubmit = {handleSubmit}>
        Ajouter un ingredient
        <div>
          <label htmlFor="nomIngredient">Nom de l'ingrédient : </label>
          <input type="text" id="nomIngredient" value={ingredientName}
            onChange={handleChangeName}/>
        </div>
        <div>
          <label htmlFor="quantiteIngredient">Quantité : </label>
          <input type="text" id="quantiteIngredient" value={ingredientQuantite}
            onChange={handleChangeQuantite}/>
          <select value={quantiteUnite} onChange={handleChangeUnite}
            aria-label="Unité">
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="cl">cl</option>
          </select>
        </div>
        <label htmlFor="datePeremption">Date de péremption : </label>
        <input type="date" id="datePeremption" value={ingredientPeremption}
          onChange={handleChangePeremption}/>
        <button>Confirmer</button>
      </form>
      <ul>
        {ingredientElement}
      </ul>
    </div>
  )
}

export default IngredientsFrigo;
