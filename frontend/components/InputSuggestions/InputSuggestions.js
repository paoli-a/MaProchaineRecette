import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Ce composant est un input permettant d'afficher une liste de
 * suggestions personnalisée.
 * Toutes les props supplémentaires seront transférées à la balise
 * interne input.
 *
 * La ref sera transférée à l'élément input. Elle peut aussi être
 * structurée sous forme d'objet contenant deux refs, "ref" et
 * "customRef", la première étant celle de react hook form, et la
 * deuxième pouvant être utilisée par exemple à des fins de focus.
 *
 * @component
 */

const InputSuggestions = React.forwardRef(function InputSuggestions(
  props,
  ref
) {
  const {
    elements,
    id,
    getElementText,
    onChangeValue,
    value,
    ...attributes
  } = props;
  const [elementsToPropose, setElementsToPropose] = useState([]);

  const handleElement = (event) => {
    if (onChangeValue) {
      onChangeValue(event.target.value);
    }
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
    attributes && attributes.onChange && attributes.onChange(event);
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
        ref={(e) => {
          if (ref) {
            if (ref.customRef || ref.ref) {
              if (ref.ref) ref.ref(e);
              if (ref.customRef) ref.customRef.current = e;
            } else if (ref) {
              ref(e);
            }
          }
        }}
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
});

InputSuggestions.propTypes = {
  /**
   * Il s'agit ici des objets contenant les textes qui seront suggérés.
   */
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
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
  onChangeValue: PropTypes.func,
  value: PropTypes.string,
};

export default InputSuggestions;
