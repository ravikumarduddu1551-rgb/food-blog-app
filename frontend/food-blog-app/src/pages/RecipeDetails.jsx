import food from '../assets/food.jpg'
import { getImageUrl } from '../api'
import { useLoaderData } from 'react-router-dom'

export default function RecipeDetails() {
    const recipe = useLoaderData()
  return (
   <>
    <div className='outer-container'>
        <div className='profile'>
            <h5>{recipe.email ?? 'Community recipe'}</h5>
        </div>
        <h3 className='title'>{recipe.title}</h3>
        <img src={getImageUrl(recipe.coverImage) ?? food} width="220px" height="200px" alt={recipe.title} />
        <div className='recipe-details'>
            <div className='ingredients'><h4>Ingredients</h4><ul>{recipe.ingredients.map((item, index)=>(<li key={index}>{item}</li>))}</ul></div>
            <div className='instructions'><h4>Instructions</h4><span>{recipe.instructions}</span></div>
        </div>
    </div>
   </>
  )
}