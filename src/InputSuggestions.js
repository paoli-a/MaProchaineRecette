import React, { useState } from "react";
import PropTypes from "prop-types";

function InputSuggestions({
  elements,
  id,
  getElementText,
  onChangeValue,
  value,
  ...attributes
}) {
  const [elementsToPropose, setElementsToPropose] = useState([]);

  const handleElement = (event) => {
    onChangeValue(event.target.value);
    const inputTextLower = event.target.value.toLowerCase();
    const elementsFiltered = elements.filter((element) => {
      const elementAutorise = getElementText(element).toLowerCase();
      const totalLetters = Math.min(
        elementAutorise.length,
        inputTextLower.length
      );
      for (let i = 0; i < totalLetters; i++) {
        if (elementAutorise[i] !== inputTextLower[i]) {
          return false;
        }
      }
      return true;
    });
    setElementsToPropose(elementsFiltered);
  };

  return (
    <React.Fragment>
      <input
        {...attributes}
        list={id + "list"}
        id={id}
        value={value}
        onChange={handleElement}
        autoComplete="off"
      />
      <datalist id={id + "list"}>
        {elementsToPropose.map((element) => {
          return (
            <option
              data-testid="suggestions"
              key={getElementText(element)}
              value={getElementText(element)}
            />
          );
        })}
      </datalist>
    </React.Fragment>
  );
}

InputSuggestions.propTypes = {
  /**
   * Il s'agit ici des objets contenant les textes qui seront suggérés.
   */
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nom: PropTypes.string.isRequired,
    })
  ).isRequired,
  id: PropTypes.string.isRequired,
  /**
   * Permet de récupérer le texte à suggérer à partir de l'élément
   */
  getElementText: PropTypes.func.isRequired,
  /**
   * Donne la valeur tapée par l'utilisateur au composant parent pour
   * qu'il puisse controler la value de l'input.
   */
  onChangeValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default InputSuggestions;
