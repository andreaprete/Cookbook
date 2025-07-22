import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchRecipes = createAsyncThunk('recipes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/cookbook/recipes');
    return res.data;
  } catch (err) {
    console.error('❌ fetchRecipes failed:', err.response?.data || err.message);
    return rejectWithValue(err.response?.data || 'Unknown error');
  }
});

export const fetchRecipe = createAsyncThunk('recipes/fetchById', async (id) => {
  const res = await axios.get(`/cookbook/recipe/${id}`);
  return res.data;
});

export const fetchCategories = createAsyncThunk('recipes/fetchCategories', async () => {
  const res = await axios.get('/cookbook/categories');
  return res.data;
});

export const searchRecipes = createAsyncThunk('recipes/search', async ({ tags, category }) => {
  const params = {};
  if (tags) params.tags = tags.join(',');
  if (category) params.category = category;
  const res = await axios.get('/cookbook/search', { params });
  return res.data;
});

function enrichRecipesWithCategories(recipes, categories) {
  return recipes.map((recipe) => {
    const matchedCategories = recipe.categories
      .map((catId) => categories.find((c) => c._id === catId))
      .filter(Boolean);
    return {
      ...recipe,
      categoryNames: matchedCategories.map((c) => c.name),
    };
  });
}

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    selectedRecipe: null,
    categories: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        // If we already have recipes, re-enrich them
        state.recipes = enrichRecipesWithCategories(state.recipes, state.categories);
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.recipes = enrichRecipesWithCategories(action.payload, state.categories);
      })
      .addCase(fetchRecipe.fulfilled, (state, action) => {
        state.selectedRecipe = action.payload;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.recipes = enrichRecipesWithCategories(action.payload, state.categories);
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
      console.error('❌ fetchRecipes failed:', action.error);
      state.error = 'Could not fetch recipes';
    });
  },
});

export default recipeSlice.reducer;
