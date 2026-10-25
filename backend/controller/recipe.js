const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const multer = require("multer");
const Recipes = require("../models/recipe");

const imageDirectory = path.resolve(__dirname, "..", "public", "images");
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      fs.mkdir(imageDirectory, { recursive: true }, (error) => {
        callback(error, imageDirectory);
      });
    },
    filename: (_req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      const error = new Error("Only JPEG, PNG, GIF, and WebP images are supported");
      error.status = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
});

const parseIngredients = (ingredients) => {
  if (Array.isArray(ingredients)) {
    return ingredients.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof ingredients !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(ingredients);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean);
    }
    if (typeof parsed === "string") {
      return parsed.split(",").map((item) => item.trim()).filter(Boolean);
    }
  } catch {
    return ingredients.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
};

const getRecipes = async (_req, res) => {
  const recipes = await Recipes.find();
  return res.json(recipes);
};

const getRecipe = async (req, res) => {
  const recipe = await Recipes.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  return res.json(recipe);
};

const addRecipe = async (req, res) => {
  const { title, instructions, time } = req.body;
  const ingredients = parseIngredients(req.body.ingredients);

  if (typeof title !== "string" || !title.trim()
    || typeof instructions !== "string" || !instructions.trim()
    || ingredients.length === 0) {
    return res.status(400).json({ message: "Title, ingredients, and instructions are required" });
  }

  const recipe = await Recipes.create({
    title: title.trim(),
    ingredients,
    instructions: instructions.trim(),
    time: typeof time === "string" ? time.trim() : "",
    coverImage: req.file?.filename ?? "",
    createdBy: req.user.id,
  });
  return res.status(201).json(recipe);
};

const findOwnedRecipe = async (id, userId) => {
  const recipe = await Recipes.findById(id);
  if (!recipe) {
    return { response: { status: 404, message: "Recipe not found" } };
  }
  if (recipe.createdBy?.toString() !== userId) {
    return { response: { status: 403, message: "You cannot modify this recipe" } };
  }
  return { recipe };
};

const editRecipe = async (req, res) => {
  const result = await findOwnedRecipe(req.params.id, req.user.id);
  if (result.response) {
    return res.status(result.response.status).json({ message: result.response.message });
  }

  const { title, instructions, time } = req.body;
  const ingredients = parseIngredients(req.body.ingredients);
  if (typeof title !== "string" || !title.trim()
    || typeof instructions !== "string" || !instructions.trim()
    || ingredients.length === 0) {
    return res.status(400).json({ message: "Title, ingredients, and instructions are required" });
  }

  result.recipe.title = title.trim();
  result.recipe.ingredients = ingredients;
  result.recipe.instructions = instructions.trim();
  result.recipe.time = typeof time === "string" ? time.trim() : "";
  if (req.file) {
    result.recipe.coverImage = req.file.filename;
  }
  await result.recipe.save();
  return res.json(result.recipe);
};

const deleteRecipe = async (req, res) => {
  const result = await findOwnedRecipe(req.params.id, req.user.id);
  if (result.response) {
    return res.status(result.response.status).json({ message: result.response.message });
  }

  await result.recipe.deleteOne();
  return res.json({ status: "ok" });
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
