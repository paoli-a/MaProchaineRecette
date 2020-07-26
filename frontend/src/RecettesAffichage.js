import React, { useState, useMemo } from "react";
import "./RecettesAffichage.css";
import Recette from "./Recette";
import RecettesToolbar from "./RecettesToolbar";
import Highlighter from "react-highlight-words";
import PropTypes from "prop-types";

function RecettesAffichage({ recettes }) {
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState("");

  const categoriesPossibles = () => {
    const categories = {};
    for (let recette of recettes) {
      for (let categorie of recette.categories)
        if (categorie in categories) {
          categories[categorie] += 1;
        } else {
          categories[categorie] = 1;
        }
    }
    return categories;
  };

  const searchedWords = useMemo(() => {
    const removePunctuation = (results) => {
      const punctuationRegex = /[…~`!@#$%^&*(){}[\];:"'<,.>?/\\|_+=-]/g;
      let resultWithoutPunctuation = results.replace(punctuationRegex, "");
      return resultWithoutPunctuation.replace(/\s{2,}/g, " ");
    };

    const removeStopwords = (results) => {
      const stopword = require("stopword");
      return stopword.removeStopwords(results, stopword.fr);
    };

    const resultWithoutPunctuation = removePunctuation(searchResults);
    return removeStopwords(resultWithoutPunctuation.split(" "));
  }, [searchResults]);

  const recettesFiltrees = useMemo(() => {
    const filtreurUtilCategories = function (recette) {
      for (let categorie of categories) {
        if (recette.categories.includes(categorie)) {
          return true;
        }
      }
      return false;
    };

    const filtreurRecettesCategories = (recettesAFiltrer) => {
      if (categories.length === 0) {
        return recettesAFiltrer;
      } else {
        return recettesAFiltrer.filter(filtreurUtilCategories);
      }
    };

    const lowerResults = (recette) => {
      const ingredientsListLower = recette.ingredients.map(
        (ingredientInfos) => {
          return ingredientInfos.ingredient.toLowerCase();
        }
      );
      const resultsLower = {
        titreRecette: recette.titre.toLowerCase(),
        description: recette.description.toLowerCase(),
        ingredientsList: ingredientsListLower,
      };
      return resultsLower;
    };

    const filtreurUtilSearch = function (recette) {
      const { titreRecette, description, ingredientsList } = lowerResults(
        recette
      );
      for (let mot of searchedWords) {
        if (mot.length > 1) {
          if (titreRecette.includes(mot) || description.includes(mot)) {
            return true;
          } else {
            for (let ingredient of ingredientsList) {
              if (ingredient.includes(mot)) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    const filtreurRecettesSearch = function (recettesAFiltrer) {
      if (searchResults.length === 0) {
        return recettesAFiltrer;
      } else {
        return recettesAFiltrer.filter(filtreurUtilSearch);
      }
    };

    return filtreurRecettesSearch(filtreurRecettesCategories(recettes));
  }, [recettes, categories, searchedWords, searchResults]);

  const handleHighlight = (texte) => {
    return (
      <Highlighter
        highlightClassName="searchHighlight"
        searchWords={searchedWords}
        textToHighlight={texte}
      />
    );
  };

  const recettesAffichees = recettesFiltrees.map((maRecette) => {
    return (
      <Recette
        key={maRecette.id}
        recette={maRecette}
        highlight={searchResults ? handleHighlight : undefined}
      />
    );
  });

  const handleChangeCategories = (updatedCategories) => {
    setCategories(updatedCategories);
  };

  const handleChangeSearch = (search) => {
    setSearchResults(search.toLowerCase());
  };

  return (
    <section id="RecettesFrigo">
      <h1>Mes prochaines recettes</h1>
      <RecettesToolbar
        onChangeCategories={handleChangeCategories}
        onChangeSearch={handleChangeSearch}
        categories={categoriesPossibles()}
      />
      <div id="RecettesAffichage">{recettesAffichees}</div>
    </section>
  );
}

RecettesAffichage.propTypes = {
  recettes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      titre: PropTypes.string.isRequired,
      ingredients: PropTypes.arrayOf(
        PropTypes.shape({
          ingredient: PropTypes.string.isRequired,
          quantite: PropTypes.string.isRequired,
          unite: PropTypes.string.isRequired,
        }).isRequired
      ),
      duree: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecettesAffichage;
