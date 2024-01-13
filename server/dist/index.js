"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const RecipeAPI = __importStar(require("./recipe-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prismaClient = new client_1.PrismaClient();
app.use(express_1.default.json());
const corsOptions = {
    origin: process.env.FRONTEND_URL,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
app.get("/api/recipes/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET http://localhost/api/recipes/search?searchTerm=burger&page=1 -> sample
    const searchTerm = req.query.searchTerm;
    const page = parseInt(req.query.page);
    const results = yield RecipeAPI.searchRecipes(searchTerm, page);
    return res.json(results);
}));
app.get("/api/recipes/:recipeId/summary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeId = req.params.recipeId;
    const results = yield RecipeAPI.getRecipeSummary(recipeId);
    return res.json(results);
}));
app.post("/api/recipes/favourite", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeId = req.body.recipeId;
    try {
        const favoriteRecipe = yield prismaClient.favouritesRecipes.create({
            data: {
                recipeId: recipeId,
            },
        });
        return res.status(201).json(favoriteRecipe);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Oops, something went wrong" });
    }
}));
app.get("/api/recipes/favourite", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield prismaClient.favouritesRecipes.findMany();
        const recipeIds = recipes.map((recipe) => recipe.recipeId.toString());
        const favourites = yield RecipeAPI.getFavouriteRecipesByIDs(recipeIds);
        res.json(favourites);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Oops, something went wrong" });
    }
}));
app.delete("/api/recipes/favourite", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeId = req.body.recipeId;
    try {
        yield prismaClient.favouritesRecipes.delete({
            where: {
                recipeId: recipeId,
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Oops, something went wrong" });
    }
}));
const port = 5000;
app.listen(port, () => {
    console.log(`server is running on localhost:${5000}`);
});
