import React from 'react';
import './RecettesAffichage.css';
import Recette from "./Recette"
import RecettesToolbar from "./RecettesToolbar"

function RecettesAffichage({recettes}) {

  const titrePage = "Recettes"
  const recette = recettes.map((maRecette) => {
    return <Recette key={maRecette.id} recette={maRecette} />
  })


  return (
      <div>
        <RecettesToolbar/>
        <div id="RecettesAffichage">
          <h1>{titrePage}</h1>
          {recette}
        </div>
      </div>
 );
}

export default RecettesAffichage;
