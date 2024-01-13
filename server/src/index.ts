import express from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import path from "path";

dotenv.config();

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
const corsOptions = {
  origin: process.env.FRONTEND_URL,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get("/api/recipes/search", async (req, res) => {
  // GET http://localhost/api/recipes/search?searchTerm=burger&page=1 -> sample

  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string);
  const results = await RecipeAPI.searchRecipes(searchTerm, page);

  return res.json(results);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
  const recipeId = req.params.recipeId;
  const results = await RecipeAPI.getRecipeSummary(recipeId);
  return res.json(results);
});

app.post("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;

  try {
    const favoriteRecipe = await prismaClient.favouritesRecipes.create({
      data: {
        recipeId: recipeId,
      },
    });
    return res.status(201).json(favoriteRecipe);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

app.get("/api/recipes/favourite", async (req, res) => {
  try {
    const recipes = await prismaClient.favouritesRecipes.findMany();
    const recipeIds = recipes.map((recipe) => recipe.recipeId.toString());

    const favourites = await RecipeAPI.getFavouriteRecipesByIDs(recipeIds);

    res.json(favourites);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

app.delete("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;

  try {
    await prismaClient.favouritesRecipes.delete({
      where: {
        recipeId: recipeId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`server is running on localhost:${5000}`);
});
