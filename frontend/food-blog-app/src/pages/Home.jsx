import { useState } from 'react'
import foodRecipe from '../assets/hero.jpg'
import RecipeItems from '../components/RecipeItems'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'

export default function Home() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const addRecipe = () => {
        const token = localStorage.getItem("token")
        if (token && token !== "null" && token !== "undefined") {
            navigate("/addRecipe")
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <section
                className='home'
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.4) 100%), url(${foodRecipe})`,
                }}
            >
                <div className='left'>
                    <h1>Food Recipe</h1>
                    <h5>Discover, create, and share delicious recipes from across the world. From comfort street food to gourmet delicacies, bring flavor into your kitchen every day.</h5>
                    <button onClick={addRecipe}>Share your recipe</button>
                </div>
                <div className='bg'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="#ffffff" fillOpacity="1" d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
                    </svg>
                </div>
            </section>
            {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
            <div className='recipe'>
                <RecipeItems />
            </div>
        </>
    )
}