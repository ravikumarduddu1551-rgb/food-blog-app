import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { api } from './api'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import Home from './pages/Home'
import RecipeDetails from './pages/RecipeDetails'
import MainNavigation from './components/MainNavigation'

const getAllRecipes = async () => {
  const response = await api.get('/recipe')
  return response.data
}

const getMyRecipes = async () => {
  let user
  try {
    user = JSON.parse(localStorage.getItem('user') ?? 'null')
  } catch {
    user = null
  }
  if (!user?._id) {
    return []
  }
  const recipes = await getAllRecipes()
  return recipes.filter((recipe) => recipe.createdBy === user._id)
}

const getFavRecipes = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem('fav') ?? '[]')
    return Array.isArray(favorites) ? favorites : []
  } catch {
    return []
  }
}

const getRecipe = async ({ params }) => {
  const response = await api.get(`/recipe/${params.id}`)
  const recipe = response.data
  if (recipe.createdBy) {
    try {
      const userResponse = await api.get(`/user/${recipe.createdBy}`)
      recipe.email = userResponse.data.email
    } catch {
      recipe.email = 'Unknown author'
    }
  }
  return recipe
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainNavigation />,
    children: [
      { index: true, element: <Home />, loader: getAllRecipes },
      { path: 'myRecipe', element: <Home />, loader: getMyRecipes },
      { path: 'favRecipe', element: <Home />, loader: getFavRecipes },
      { path: 'addRecipe', element: <AddFoodRecipe /> },
      { path: 'editRecipe/:id', element: <EditRecipe /> },
      { path: 'recipe/:id', element: <RecipeDetails />, loader: getRecipe },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
