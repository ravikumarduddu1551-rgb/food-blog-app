import { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { notifyAuthChanged } from '../api'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { FaSearch, FaTimes } from 'react-icons/fa'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token')
    return Boolean(token && token !== 'null' && token !== 'undefined')
  })
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') ?? 'null')
    } catch {
      return null
    }
  })
  const isLogin = !isLoggedIn

  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('q') ?? ''
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(Boolean(token && token !== 'null' && token !== 'undefined'))
      try {
        setUser(JSON.parse(localStorage.getItem('user') ?? 'null'))
      } catch {
        setUser(null)
      }
    }
    window.addEventListener('auth-change', updateAuth)
    return () => window.removeEventListener('auth-change', updateAuth)
  }, [])

  const checkLogin = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      notifyAuthChanged()
    } else {
      setIsOpen(true)
    }
  }

  const handleSearchChange = (event) => {
    const value = event.target.value
    const isListingPage = ['/', '/myRecipe', '/favRecipe'].includes(location.pathname)

    if (value.trim()) {
      if (isListingPage) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          next.set('q', value)
          return next
        }, { replace: true })
      } else {
        navigate(`/?q=${encodeURIComponent(value)}`)
      }
    } else {
      if (isListingPage) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          next.delete('q')
          return next
        }, { replace: true })
      } else {
        navigate('/')
      }
    }
  }

  const handleClearSearch = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('q')
      return next
    }, { replace: true })
  }

  return (
    <>
      <header>
        <div className='navbar-top'>
          <h2>Food Blog</h2>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to={ !isLogin ? "/myRecipe" : "/"} onClick={(event)=>{if(isLogin){event.preventDefault();setIsOpen(true)}}}>My Recipe</NavLink></li>
            <li><NavLink to={ !isLogin ? "/favRecipe" : "/"} onClick={(event)=>{if(isLogin){event.preventDefault();setIsOpen(true)}}}>Favourites</NavLink></li>
            <li onClick={checkLogin}><p className='login'>{ (isLogin)? "Login": "Logout" }{user?.email ? `(${user?.email})` : ""}</p></li>
          </ul>
        </div>
        <div className='navbar-search'>
          <div className='search-input-wrapper'>
            <FaSearch className='search-icon' />
            <input
              type='text'
              placeholder='Search dishes by name or ingredients (e.g. Biryani, Chicken, Naan)...'
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label='Search dishes'
            />
            {searchTerm && (
              <button
                type='button'
                className='clear-search'
                onClick={handleClearSearch}
                aria-label='Clear search'
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </header>
      {(isOpen) && <Modal onClose={()=>setIsOpen(false)}><InputForm setIsOpen={()=>setIsOpen(false)}/></Modal>}
    </>
  )
}