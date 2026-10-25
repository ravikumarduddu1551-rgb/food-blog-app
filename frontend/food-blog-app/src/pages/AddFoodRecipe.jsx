import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, createRecipeFormData } from '../api'

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({ title: '', time: '', ingredients: '', instructions: '', file: null })
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()

    const onHandleChange = (event) => {
        const value = event.target.name === 'file' ? event.target.files[0] : event.target.value
        setRecipeData((previous) => ({ ...previous, [event.target.name]: value }))
    }

    const onHandleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsSaving(true)
        try {
            const data = {
                ...recipeData,
                ingredients: recipeData.ingredients.split(',').map((item) => item.trim()).filter(Boolean),
            }
            await api.post('/recipe', createRecipeFormData(data), {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            navigate('/')
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Unable to save this recipe. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className='container'>
            <form className='form' onSubmit={onHandleSubmit}>
                <div className='form-control'>
                    <label htmlFor='title'>Title</label>
                    <input id='title' type='text' className='input' name='title' value={recipeData.title} onChange={onHandleChange} required />
                </div>
                <div className='form-control'>
                    <label htmlFor='time'>Time</label>
                    <input id='time' type='text' className='input' name='time' value={recipeData.time} onChange={onHandleChange} />
                </div>
                <div className='form-control'>
                    <label htmlFor='ingredients'>Ingredients</label>
                    <textarea id='ingredients' className='input-textarea' name='ingredients' rows='5' value={recipeData.ingredients} onChange={onHandleChange} required />
                </div>
                <div className='form-control'>
                    <label htmlFor='instructions'>Instructions</label>
                    <textarea id='instructions' className='input-textarea' name='instructions' rows='5' value={recipeData.instructions} onChange={onHandleChange} required />
                </div>
                <div className='form-control'>
                    <label htmlFor='file'>Recipe image</label>
                    <input id='file' type='file' accept='image/jpeg,image/png,image/gif,image/webp' className='input' name='file' onChange={onHandleChange} />
                </div>
                {error && <p className='error' role='alert'>{error}</p>}
                <button type='submit' disabled={isSaving}>{isSaving ? 'Saving...' : 'Add Recipe'}</button>
            </form>
        </div>
    )
}
