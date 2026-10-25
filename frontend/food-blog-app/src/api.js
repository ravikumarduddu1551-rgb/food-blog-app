import axios from 'axios'

const backendUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export const api = axios.create({
  baseURL: `${backendUrl}/api`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const notifyAuthChanged = () => {
  window.dispatchEvent(new Event('auth-change'))
}

import chickenBiryaniImg from './assets/Chicken-Biryani.jpg'
import butterChickenImg from './assets/butter-chicken.webp'
import butterNaanImg from './assets/butter-naan.jpg'
import muttonBiryaniImg from './assets/mutton-biryani.jpg'
import prawnsBiryaniImg from './assets/prawns-biryani.jpg'
import defaultFoodImg from './assets/food.jpg'

const localAssets = {
  'Chicken-Biryani.jpg': chickenBiryaniImg,
  'butter-chicken.webp': butterChickenImg,
  'butter-naan.jpg': butterNaanImg,
  'mutton-biryani.jpg': muttonBiryaniImg,
  'prawns-biryani.jpg': prawnsBiryaniImg,
  'food.jpg': defaultFoodImg,
}

export const getImageUrl = (filename) => {
  if (!filename) return defaultFoodImg
  if (localAssets[filename]) return localAssets[filename]
  return `${backendUrl}/images/${encodeURIComponent(filename)}`
}

export const createRecipeFormData = (recipe) => {
  const formData = new FormData()
  formData.append('title', recipe.title ?? '')
  formData.append('time', recipe.time ?? '')
  formData.append('instructions', recipe.instructions ?? '')
  formData.append('ingredients', JSON.stringify(recipe.ingredients ?? []))
  if (recipe.file) {
    formData.append('file', recipe.file)
  }
  return formData
}
