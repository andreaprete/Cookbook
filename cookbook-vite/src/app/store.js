import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from '../features/recipes/recipeSlice';
import userReducer from '../features/user/userSlice';
import bookmarksReducer from '../features/bookmarks/bookmarksSlice'; // ✅

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    user: userReducer,
    bookmarks: bookmarksReducer,
  },
});
