import { useState } from 'react'
import { Link, useLoaderData, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BsStopwatchFill } from 'react-icons/bs'
import { FaHeart, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import foodImage from '../assets/food.jpg'
import { api, getImageUrl } from '../api'

const readFavorites = () => {
    try {
        const favorites = JSON.parse(localStorage.getItem('fav') ?? '[]')
        return Array.isArray(favorites) ? favorites : []
    } catch {
        return []
    }
}

export default function RecipeItems() {
    const recipes = useLoaderData()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [deletedRecipes, setDeletedRecipes] = useState(() => new Set())
    const [unfavoritedIds, setUnfavoritedIds] = useState(() => new Set())
    const [, setFavoritesChanged] = useState(false)
    const [error, setError] = useState('')
    const isMyRecipes = location.pathname === '/myRecipe'
    const isFavRecipes = location.pathname === '/favRecipe'
    const navigate = useNavigate()
    const favoriteItems = readFavorites()

    const query = (searchParams.get('q') || '').trim().toLowerCase()

    const onDelete = async (event, id) => {
        event.stopPropagation()
        setError('')
        try {
            await api.delete(`/recipe/${id}`)
            setDeletedRecipes((currentRecipes) => new Set([...currentRecipes, id]))
            localStorage.setItem('fav', JSON.stringify(favoriteItems.filter((recipe) => recipe._id !== id)))
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Unable to delete this recipe.')
        }
    }

    const toggleFavorite = (event, item) => {
        event.stopPropagation()
        const isCurrentlyFavorite = favoriteItems.some((recipe) => recipe._id === item._id)
        const updatedFavorites = isCurrentlyFavorite
            ? favoriteItems.filter((recipe) => recipe._id !== item._id)
            : [...favoriteItems, item]
        localStorage.setItem('fav', JSON.stringify(updatedFavorites))
        if (isCurrentlyFavorite && isFavRecipes) {
            setUnfavoritedIds((previous) => new Set([...previous, item._id]))
        }
        setFavoritesChanged((previous) => !previous)
    }

    const filteredRecipes = recipes?.filter((item) => {
        if (deletedRecipes.has(item._id)) return false
        if (isFavRecipes && unfavoritedIds.has(item._id)) return false
        if (!query) return true

        const matchesTitle = item.title?.toLowerCase().includes(query)
        const matchesIngredients = Array.isArray(item.ingredients)
            ? item.ingredients.some((ing) => String(ing).toLowerCase().includes(query))
            : typeof item.ingredients === 'string' && item.ingredients.toLowerCase().includes(query)
        const matchesInstructions = item.instructions?.toLowerCase().includes(query)

        return Boolean(matchesTitle || matchesIngredients || matchesInstructions)
    })

    return (
        <>
            {error && <p className='error' role='alert'>{error}</p>}
            {query && (
                <div className='search-results-info'>
                    Showing results for &ldquo;<strong>{query}</strong>&rdquo; ({filteredRecipes?.length ?? 0} found)
                </div>
            )}
            {filteredRecipes && filteredRecipes.length === 0 ? (
                <div className='no-recipes-found'>
                    <p>No dishes found matching &ldquo;<strong>{query}</strong>&rdquo;.</p>
                    <p className='no-recipes-hint'>Try searching for a different dish name or ingredient (e.g. Biryani, Chicken, Butter).</p>
                </div>
            ) : (
                <div className='card-container'>
                    {filteredRecipes?.map((item) => (
                        <div key={item._id} className='card' onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
                            <img src={getImageUrl(item.coverImage) ?? foodImage} alt={item.title} />
                            <div className='card-body'>
                            <div className='title'>{item.title}</div>
                            <div className='icons'>
                                <div className='timer'><BsStopwatchFill />{item.time}</div>
                                {isMyRecipes ? (
                                    <div className='action'>
                                        <Link to={`/editRecipe/${item._id}`} className='editIcon' onClick={(e) => e.stopPropagation()} aria-label={`Edit ${item.title}`}><FaEdit /></Link>
                                        <button type='button' className='icon-button' onClick={(e) => onDelete(e, item._id)} aria-label={`Delete ${item.title}`}><MdDelete className='deleteIcon' /></button>
                                    </div>
                                ) : (
                                    <button
                                        type='button'
                                        className='icon-button'
                                        onClick={(e) => toggleFavorite(e, item)}
                                        aria-label={favoriteItems.some((recipe) => recipe._id === item._id) ? `Remove ${item.title} from favourites` : `Add ${item.title} to favourites`}
                                    >
                                        <FaHeart style={{ color: favoriteItems.some((recipe) => recipe._id === item._id) ? 'red' : '' }} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
        </>
    )
}

