import React, { useState, useEffect } from "react";
import RecettesForm from "./RecettesForm";
import Recette from "./Recette";
import useFilterSearch from "./useFilterSearch";
import "./RecettesCatalogue.css";
import PropTypes from "prop-types";
import axios from "axios";

function RecettesCatalogue({ totalRecettes, ingredientsPossibles }) {
  const [recettesList, setRecettes] = useState(totalRecettes);
  const [searchResults, setSearchResults] = useState("");
  const [deleteError, setDeleteError] = useState({});
  const [postError, setPostError] = useState("");

  useEffect(() => {
    setRecettes(totalRecettes);
  }, [totalRecettes]);

  const handleSupprClick = (id) => {
    axios
      .delete(`/catalogues/recettes/${id}/`)
      .then(() => {
        const recettesUpdated = recettesList.slice();
        const index = recettesUpdated.findIndex((recette) => {
          return recette.id === id;
        });
        recettesUpdated.splice(index, 1);
        setRecettes(recettesUpdated);
      })
      .catch((e) => {
        console.log(e.response);
        setDeleteError({
          id: id,
          message:
            "La suppression a échoué. Veuillez réessayer ultérieurement.",
        });
      });
  };

  const handleSubmit = (data) => {
    const categories = data.categories.filter(Boolean);
    const recetteAEnvoyer = {
      categories: categories,
      titre: data.titreRecette,
      ingredients: data.ingredients,
      duree: data.tempsRecette,
      description: data.descriptionRecette,
    };
    axios
      .post("/catalogues/recettes/", recetteAEnvoyer)
      .then(({ data }) => {
        const nouvelleRecette = data;
        const recettesUpdated = recettesList.slice();
        recettesUpdated.push(nouvelleRecette);
        setRecettes(recettesUpdated);
      })
      .catch((e) => {
        setPostError("L'ajout de recette a échoué.");
      });
  };

  const handleChangeSearch = (event) => {
    setSearchResults(event.target.value);
  };

  const recettesFiltres = useFilterSearch({
    elementsToFilter: recettesList,
    searchResults: searchResults,
    getSearchElement: (recette) => recette.titre,
  });

  const toutesMesRecettes = recettesFiltres.map((maRecette) => {
    const button = (
      <button onClick={() => handleSupprClick(maRecette.id)}>X</button>
    );
    return (
      <React.Fragment key={maRecette.id}>
        <Recette
          key={maRecette.id}
          recette={maRecette}
          activateClick={true}
          optionalButton={button}
        />
        {deleteError.id === maRecette.id && <span>{deleteError.message}</span>}
      </React.Fragment>
    );
  });

  return (
    <main id="ComponentCatalogueRecette">
      <h1>Catalogue de toutes mes recettes</h1>
      <section id="AjoutRecette">
        <RecettesForm
          onSubmitRecette={handleSubmit}
          ingredientsPossibles={ingredientsPossibles}
        />
        {postError && <span>{postError}</span>}
      </section>
      <section id="DisplayCatalogueRecette">
        <form>
          <input
            type="search"
            id="rechercheCatalogueRecette"
            name="q"
            value={searchResults}
            placeholder="Recherche par titre..."
            spellCheck="true"
            size="30"
            onChange={handleChangeSearch}
          />
        </form>
        {toutesMesRecettes}
      </section>
    </main>
  );
}

RecettesCatalogue.propTypes = {
  totalRecettes: PropTypes.arrayOf(
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
  /**
   * Il s'agit ici des ingrédients autorisés, c'est-à-dire ceux entrés
   * dans le catalogue des ingrédients.
   */
  ingredientsPossibles: PropTypes.arrayOf(
    PropTypes.shape({
      nom: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecettesCatalogue;
