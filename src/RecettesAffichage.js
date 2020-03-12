import React from 'react';
import './RecettesAffichage.css';
import Recette from "./Recette"

function RecettesAffichage({recettes}) {

  const titrePage = "Recettes"
  const recette = recettes.map((maRecette) => {
    return <Recette key={maRecette.id} recette={maRecette} />
  })


  return (
      <div className="RecettesAffichage">
        <h1>{titrePage}</h1>
        {recette}
      </div>
 );
}

export default RecettesAffichage;
