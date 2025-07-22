import { createSelector } from '@reduxjs/toolkit';

export const selectSavedRecipeIds = createSelector(
  (state) => state.user.currentUser?.savedRecipes,
  (savedRecipes) => savedRecipes || []
);