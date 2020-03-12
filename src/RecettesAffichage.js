import React from 'react';
import './RecettesAffichage.css';
import Recette from "./Recette"

function RecettesAffichage({recettes}) {

  const titrePage = "Recettes"
  const recette = recettes.map((ma_recette) => {
    return <Recette recette={ma_recette} />
  })


  return (
      <div className="RecettesAffichage">
        <h1>{titrePage}</h1>
        {recette}
      </div>
 );
}

export default RecettesAffichage;
