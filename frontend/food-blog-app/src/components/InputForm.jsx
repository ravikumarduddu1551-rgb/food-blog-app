import { useState } from 'react'
import { api, notifyAuthChanged } from '../api'

export default function InputForm({ setIsOpen }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState('')

    const handleOnSubmit = async (event) => {
        event.preventDefault()
        setError('')
        try {
            const endpoint = isSignUp ? 'signUp' : 'login'
            const response = await api.post(`/${endpoint}`, { email, password })
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            notifyAuthChanged()
            setIsOpen()
        } catch (requestError) {
            setError(requestError.response?.data?.error ?? requestError.response?.data?.message ?? 'Unable to sign in. Please try again.')
        }
    }

    return (
        <form className='form' onSubmit={handleOnSubmit}>
            <div className='form-control'>
                <label htmlFor='email'>Email</label>
                <input id='email' type='email' className='input' value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className='form-control'>
                <label htmlFor='password'>Password</label>
                <input id='password' type='password' className='input' value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <button type='submit'>{isSignUp ? 'Sign Up' : 'Login'}</button>
            {error && <p className='error' role='alert'>{error}</p>}
            <div>
                <p
                    className='form-toggle'
                    role='button'
                    tabIndex={0}
                    onClick={() => setIsSignUp((previous) => !previous)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            setIsSignUp((previous) => !previous)
                        }
                    }}
                >
                    {isSignUp ? 'Already have an account?' : 'Create new account'}
                </p>
            </div>
        </form>
    )
}
