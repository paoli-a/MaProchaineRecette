import React, { useState, useMemo }  from 'react';
import './RecettesAffichage.css';
import Recette from "./Recette"
import RecettesToolbar from "./RecettesToolbar"


function RecettesAffichage({recettes}) {

  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState("");
  const titrePage = "Recettes"

  const recettesFiltrees = useMemo(() => {
    const filtreurUtilCategories = function(recette) {
      for (let categorie of categories) {
        if (recette.categorie.includes(categorie)) {
          return true
        }
      }
      return false
    }

    const filtreurRecettesCategories = function(recettesAFiltrer) {
      if (categories.length === 0) {
        return recettesAFiltrer
      }
      else {
        return recettesAFiltrer.filter(filtreurUtilCategories);
      }
    }

    const lowerResults = (recette) => {
      const ingredients = Object.keys(recette.ingredients)
      const ingredientsListLower = ingredients.map((ingredient) => {
        return ingredient.toLowerCase()
      })
      const resultsLower = {
        titreRecette : recette.titre.toLowerCase(),
        description : recette.description.toLowerCase(),
        ingredientsList : ingredientsListLower
      }
      return resultsLower
    }


    const filtreurUtilSearch = function(recette) {
      const mots = searchResults.split(" ")
      const { titreRecette, description, ingredientsList } = lowerResults(recette)
      for (let mot of mots) {
        if (mot.length > 3) {
          if (titreRecette.includes(mot) || description.includes(mot)) {
            return true
          }
          else {
            for (let ingredient of ingredientsList) {
              if (ingredient.includes(mot)) {
                return true
              }
            }
          }
        }
      }
      return false
    }

    const filtreurRecettesSearch = function(recettesAFiltrer) {
      if (searchResults.length === 0) {
          return recettesAFiltrer
        }
        else {
          return recettesAFiltrer.filter(filtreurUtilSearch);
        }
    }

    return filtreurRecettesSearch(filtreurRecettesCategories(recettes))
  }, [recettes, categories, searchResults])

  const recettesAffichees = recettesFiltrees.map((maRecette) => {
    return <Recette key={maRecette.id} recette={maRecette}/>
  })

  const handleChangeCategories = (updatedCategories) => {
    setCategories(updatedCategories)
  }

  const handleChangeSearch = (search) => {
    setSearchResults(search.toLowerCase())
  }

  return (
      <div>
        <h1>{titrePage}</h1>
        <RecettesToolbar onChangeCategories={handleChangeCategories}
          onChangeSearch={handleChangeSearch}/>
        <div id="RecettesAffichage">
          {recettesAffichees}
        </div>
      </div>
 );
}

export default RecettesAffichage;
