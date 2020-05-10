import React, {useState, useEffect} from 'react';
import IngredientsList from "./IngredientsList"
import './Recette.css';

function Recette({recette, optionalButton, activateClick}) {

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
      return <h2 className="curseurMain"onClick={handleTitleClick}> {recette.titre} {optionalButton}</h2>
    }
    else {
      return <h2> {recette.titre} {optionalButton}</h2>
    }
  }

  return (
    <article className="Recette">
      {title()}
      <div className={isRecetteOpen ? null : "hidden"}>
        <IngredientsList ingredients={recette.ingredients} />
        <p>{recette.description}</p>
      </div>
    </article>
 );
}

export default Recette;
