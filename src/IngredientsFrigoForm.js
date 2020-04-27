import React from 'react';
import { useForm } from 'react-hook-form';

function IngredientsFrigoForm ({onSubmit}) {

  const { register, handleSubmit, errors, reset } = useForm()

  const onSubmitWrapper = (data) => {
    onSubmit(data)
    reset()
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
        ref={register({ required: true })} defaultValue=""/>
        {errors.quantiteIngredient && <span>Ce champ est obligatoire</span>}
        <select name="unite" defaultValue="" ref={register({ required: true })}
          aria-label="Unité">
          <option value="">...</option>
          <option value="pièce">pièce</option>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="cl">cl</option>
        </select>
        {errors.unite && <span>Ce champ est obligatoire</span>}
      </div>
      <label htmlFor="datePeremption">Date de péremption : </label>
      <input type="date" name="datePeremption" id="datePeremption"
      ref={register({ required: true })} defaultValue=""/>
      {errors.datePeremption && <span>Ce champ est obligatoire</span>}
      <div>
      <input type="submit" value="Confirmer"/>
      </div>
      </fieldset>
    </form>
  )
}

export default IngredientsFrigoForm;
