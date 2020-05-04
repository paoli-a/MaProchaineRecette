import React, {useState} from 'react';
import RecettesForm from "./RecettesForm"
import Recette from "./Recette"

function RecettesCatalogue ({totalRecettes}) {

  const [recettesList, setRecettes] = useState(totalRecettes);

  const toutesMesRecettes = recettesList.map((maRecette) => {
    return (
        <Recette key={maRecette.id} recette={maRecette} 
        optionalButton=<button onClick={() => handleSupprClick(maRecette.id)} >
        X</button>/>
    )
  })

  const handleSupprClick = (id) => {
      const recettes = recettesList.slice()
      const index = recettes.findIndex((recette) => {
        return recette.id === id
      });
      recettes.splice(index,1);
      setRecettes(recettes)
    }

  const handleSubmit = (data) => {
    const id = new Date().getTime();
    const recettes = recettesList.slice()
    const quantite = data.ingredientQuantite + "";
    const formatedQuantite = quantite + " " + data.unite;
    const formatedIngredient = { [data.ingredient] : formatedQuantite}
    const categories = data.categorie.filter(Boolean)
    const nouvelleRecette = {id : id,
                            categories : categories,
                            titre : data.titreRecette,
                            ingredients: formatedIngredient,
                            temps : data.tempsRecette,
                            description: data.descriptionRecette}
    recettes.push(nouvelleRecette);
    setRecettes(recettes)
  }


  return (
    <div>
      <h1>Catalogue de toutes mes recettes</h1>
      <RecettesForm onSubmitRecette={handleSubmit}/>
      {toutesMesRecettes}
    </div>
  )
}

export default RecettesCatalogue;
