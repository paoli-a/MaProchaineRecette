import React, { useState } from "react";
import RecettesForm from "./RecettesForm";
import Recette from "./Recette";
import useFilterSearch from "./useFilterSearch";
import "./RecettesCatalogue.css";

function RecettesCatalogue({ totalRecettes, ingredientsPossibles }) {
  const [recettesList, setRecettes] = useState(totalRecettes);
  const [searchResults, setSearchResults] = useState("");

  const handleSupprClick = (id) => {
    const recettes = recettesList.slice();
    const index = recettes.findIndex((recette) => {
      return recette.id === id;
    });
    recettes.splice(index, 1);
    setRecettes(recettes);
  };

  const handleSubmit = (data) => {
    const id = new Date().getTime();
    const recettes = recettesList.slice();
    const formatedIngredients = {};
    for (let ingredient of data.ingredients) {
      const quantite = ingredient.quantite + "";
      const formatedQuantite = quantite + " " + ingredient.unite;
      formatedIngredients[ingredient.nom] = formatedQuantite;
    }
    const categories = data.categorie.filter(Boolean);
    const nouvelleRecette = {
      id: id,
      categories: categories,
      titre: data.titreRecette,
      ingredients: formatedIngredients,
      temps: data.tempsRecette,
      description: data.descriptionRecette,
    };
    recettes.push(nouvelleRecette);
    setRecettes(recettes);
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
    return (
      <Recette
        key={maRecette.id}
        recette={maRecette}
        activateClick={true}
        optionalButton=<button onClick={() => handleSupprClick(maRecette.id)}>
          X
        </button>
      />
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

export default RecettesCatalogue;
