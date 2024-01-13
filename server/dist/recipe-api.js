"use strict";
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
exports.getFavouriteRecipesByIDs = exports.getRecipeSummary = exports.searchRecipes = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.API_KEY;
const searchRecipes = (searchTerm, page) => __awaiter(void 0, void 0, void 0, function* () {
    if (!apiKey) {
        throw new Error("API key not found");
    }
    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
    const queryParams = {
        apiKey,
        query: searchTerm,
        number: "10",
        offset: (page * 10).toString(),
    };
    url.search = new URLSearchParams(queryParams).toString();
    try {
        const searchResponse = yield fetch(url);
        // console.log("🚀 ~ file: recipe-api.ts:25 ~ searchRecipes ~ url:", url)
        const resultsJson = yield searchResponse.json();
        return resultsJson;
    }
    catch (error) {
        console.log(error);
    }
});
exports.searchRecipes = searchRecipes;
const getRecipeSummary = (recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!apiKey) {
        throw new Error("API key not found");
    }
    const url = new URL(`https://api.spoonacular.com/recipes/${recipeId}/summary`);
    const params = {
        apiKey: apiKey,
    };
    url.search = new URLSearchParams(params).toString();
    const response = yield fetch(url);
    const json = yield response.json();
    return json;
});
exports.getRecipeSummary = getRecipeSummary;
const getFavouriteRecipesByIDs = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    if (!apiKey) {
        throw new Error("API key not found");
    }
    const url = new URL("https://api.spoonacular.com/recipes/informationBulk");
    const params = {
        apiKey: apiKey,
        ids: ids.join(","),
    };
    url.search = new URLSearchParams(params).toString();
    const searchResponse = yield fetch(url);
    const json = yield searchResponse.json();
    return { results: json };
});
exports.getFavouriteRecipesByIDs = getFavouriteRecipesByIDs;
