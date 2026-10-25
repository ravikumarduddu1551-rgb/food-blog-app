const express=require("express")
const { getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload} = require("../controller/recipe")
const verifyToken = require("../middleware/auth")
const router=express.Router()

router.get("/",getRecipes) //Get all recipes
router.get("/:id",getRecipe) //Get recipe by id
router.post("/",verifyToken,upload.single('file'),addRecipe) //add recipe
router.put("/:id",verifyToken,upload.single('file'),editRecipe) //Edit recipe
router.delete("/:id",verifyToken,deleteRecipe) //Delete recipe

module.exports=router