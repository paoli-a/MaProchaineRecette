import React, { ChangeEvent, useState } from "react";

type ElementType = { name: string };

type InputSuggestionsProps = {
  /**
   * Il s'agit ici des objets contenant les textes qui seront suggérés.
   */
  elements: ElementType[];
  id: string;
  /**
   * Permet de récupérer le texte à suggérer à partir de l'élément
   */
  getElementText: (element: ElementType) => string;
  /**
   * Donne la valeur tapée par l'utilisateur au composant parent pour
   * qu'il puisse controler la value de l'input.
   */
  onChangeValue?: (value: string) => string;
  value?: string;
  [attributes: string]: any;
};

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

const InputSuggestions = React.forwardRef<
  HTMLInputElement,
  InputSuggestionsProps
>(function InputSuggestions(
  {
    elements,
    id,
    getElementText,
    onChangeValue,
    value,
    customRef,
    ...attributes
  },
  ref
) {
  const [elementsToPropose, setElementsToPropose] = useState([]);

  const handleElement = (event: ChangeEvent<HTMLInputElement>) => {
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
          if (ref && ref instanceof Function) {
            ref(e);
          }
          if (customRef) {
            customRef.current = e;
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

export default InputSuggestions;
