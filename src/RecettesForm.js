import React from 'react';
import { useForm } from 'react-hook-form';

function RecettesForm () {

  const { register, handleSubmit, errors, reset} = useForm()

  const onSubmitWrapper = (data) => {
    reset()
  }


  return(
    <form id="formRecette" onSubmit={handleSubmit(onSubmitWrapper)}>
      <div>
        <label htmlFor="titreRecette"> Titre de la recette : </label>
        <input type="text" name="titreRecette" id="titreRecette" defaultValue=""
        ref={register({ required: true })}/>
        {errors.titreRecette && <span>Ce champ est obligatoire</span>}
        <label htmlFor="descriptionRecette"> Titre de la recette : </label>
        <input type="text" name="descriptionRecette" id="descriptionRecette" defaultValue=""
        ref={register({ required: true })}/>
        {errors.titreRecette && <span>Ce champ est obligatoire</span>}
      </div>
    </form>

  )
}

export default RecettesForm;
