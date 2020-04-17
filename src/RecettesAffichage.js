import React, {useState}  from 'react';
import './RecettesAffichage.css';
import Recette from "./Recette"
import RecettesToolbar from "./RecettesToolbar"

function RecettesAffichage({recettes}) {

  const [categories, setCategories] = useState([]);
  const titrePage = "Recettes"


  const filtreurUtil = function(recette) {
    for (let categorie of categories) {
      if (recette.categorie.includes(categorie)) {
        return true
      }
    }
    return false
  }

  const filtreurRecettes = function() {
    let mesRecettes = recettes.slice(recettes)
    if (categories.length === 0) {
      return mesRecettes
    }
    else {
      return mesRecettes.filter(filtreurUtil);
    }
  }

  const recettesVoules = filtreurRecettes()
  const recettesAffichees = recettesVoules.map((maRecette) => {
    return <Recette key={maRecette.id} recette={maRecette} />
  })

  const handleChange = (updatedCategories) => {
    setCategories(updatedCategories)
  }

  return (
      <div>
        <RecettesToolbar onChange={handleChange}/>
        <div id="RecettesAffichage">
          <h1>{titrePage}</h1>
          {recettesAffichees}
        </div>
      </div>
 );
}

export default RecettesAffichage;
