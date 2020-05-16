import React, {useState, useEffect} from 'react';
import IngredientsList from "./IngredientsList"
import './Recette.css';


Recette.defaultProps = {
  highlight: (texte) => texte
}

function Recette({recette, optionalButton, activateClick, highlight}) {

  const [isRecetteOpen, setRecetteOpen] = useState()

  useEffect(() => {
      if (activateClick === true){
        setRecetteOpen(false)
      }
      else {
        setRecetteOpen(true)
      }
    }, [activateClick]);

  const handleTitleClick = () => {
     setRecetteOpen(!isRecetteOpen)
    }

  const title = () => {
    if (activateClick){
      return (
        <h2 className="curseurMain" onClick={handleTitleClick}>
          {highlight(recette.titre)} {optionalButton}</h2>
      )
    }
    else {
      return <h2> {highlight(recette.titre)} {optionalButton}</h2>
    }
  }

  return (
    <article className="Recette">
      {title()}
      <div className={isRecetteOpen ? null : "hidden"}>
        <IngredientsList ingredients={recette.ingredients} highlight={highlight} />
        <p>{highlight(recette.description)}</p>
      </div>
    </article>
 );
}

export default Recette;
