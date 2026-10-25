import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, createRecipeFormData } from '../api'

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({ title: '', time: '', ingredients: '', instructions: '', file: null })
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        let cancelled = false
        const getData = async () => {
            try {
                const response = await api.get(`/recipe/${id}`)
                if (!cancelled) {
                    const recipe = response.data
                    setRecipeData({
                        title: recipe.title ?? '',
                        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : '',
                        instructions: recipe.instructions ?? '',
                        time: recipe.time ?? '',
                        file: null,
                    })
                }
            } catch (requestError) {
                if (!cancelled) {
                    setError(requestError.response?.data?.message ?? 'Unable to load this recipe.')
                }
            }
        }
        getData()
        return () => {
            cancelled = true
        }
    }, [id])

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
            await api.put(`/recipe/${id}`, createRecipeFormData(data), {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            navigate('/myRecipe')
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Unable to update this recipe. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className='container'>
            <form className='form' onSubmit={onHandleSubmit}>
                <div className='form-control'>
                    <label htmlFor='title'>Title</label>
                    <input id='title' type='text' className='input' name='title' onChange={onHandleChange} value={recipeData.title} required />
                </div>
                <div className='form-control'>
                    <label htmlFor='time'>Time</label>
                    <input id='time' type='text' className='input' name='time' onChange={onHandleChange} value={recipeData.time} />
                </div>
                <div className='form-control'>
                    <label htmlFor='ingredients'>Ingredients</label>
                    <textarea id='ingredients' className='input-textarea' name='ingredients' rows='5' onChange={onHandleChange} value={recipeData.ingredients} required />
                </div>
                <div className='form-control'>
                    <label htmlFor='instructions'>Instructions</label>
                    <textarea id='instructions' className='input-textarea' name='instructions' rows='5' onChange={onHandleChange} value={recipeData.instructions} required />
                </div>
                <div className='form-control'>
                    <label htmlFor='file'>Recipe image</label>
                    <input id='file' type='file' accept='image/jpeg,image/png,image/gif,image/webp' className='input' name='file' onChange={onHandleChange} />
                </div>
                {error && <p className='error' role='alert'>{error}</p>}
                <button type='submit' disabled={isSaving}>{isSaving ? 'Saving...' : 'Edit Recipe'}</button>
            </form>
        </div>
    )
}
