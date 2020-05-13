import React from 'react';
import { useForm } from 'react-hook-form';

function IngredientsFrigoForm ({onSubmit}) {

  const { register, handleSubmit, errors, reset, getValues } = useForm()

  const onSubmitWrapper = (data) => {
    onSubmit(data)
    reset()
  }

  const validateQuantite = () => {
    if (getValues().quantiteIngredient <= 0) {
      return "La quantité doit être supérieure à 0"
    }
    else
      return undefined
  }

  const validateDate = () => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const inputDate = new Date (getValues().datePeremption)
    inputDate.setHours(0, 0, 0, 0)
    if (currentDate.getTime() > inputDate.getTime()) {
      return "L'ingrédient est déjà perimé"
    }
    else
      return undefined
  }

  return(

    <form id="formFrigo" onSubmit={handleSubmit(onSubmitWrapper)}>
    <fieldset>
    <legend>Ajouter un ingredient frigo</legend>
      <div>
        <label htmlFor="nomIngredient"> Nom de l'ingrédient : </label>
        <input type="text" name="nomIngredient" id="nomIngredient" defaultValue=""
        ref={register({ required: true })}/>
        {errors.nomIngredient && <span>Ce champ est obligatoire</span>}
      </div>
      <div>
        <label htmlFor="quantiteIngredient">Quantité : </label>
        <input type="number" name="quantiteIngredient" id="quantiteIngredient"
          defaultValue="" ref={register({
            required: "Ce champ est obligatoire",
            validate: validateQuantite
        })} />
        {errors.quantiteIngredient && errors.quantiteIngredient.message}
        <select name="unite" defaultValue="" ref={register({ required: true })}
          aria-label="Unité">
          <option value="">...</option>
          <option value="pièce(s)">pièce(s)</option>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="cl">cl</option>
        </select>
        {errors.unite && <span>Ce champ est obligatoire</span>}
      </div>
      <div>
        <label htmlFor="datePeremption">Date de péremption : </label>
        <input type="date" name="datePeremption" id="datePeremption"
        ref={register({
          required: "Ce champ est obligatoire",
          validate: validateDate
        })} />
        {errors.datePeremption && errors.datePeremption.message}
      </div>
      <input type="submit" value="Confirmer"/>
      </fieldset>
    </form>
  )
}

export default IngredientsFrigoForm;
