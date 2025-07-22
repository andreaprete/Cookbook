import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRecipes,
  fetchCategories,
} from '../features/recipes/recipeSlice';
import RecipeCard from '../components/RecipeCard';

export default function Home() {
  const dispatch = useDispatch();
  const { recipes, categories, loading, error } = useSelector((state) => state.recipes);

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRecipes()); // always fetch all recipes once
  }, [dispatch]);

  const parseTags = (input) => {
    return input
      .split(/[,\s]+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleSearch = () => {
    // No dispatch needed — filtering happens locally
  };

  // 🔍 DEBUG LOGS
  console.log('Selected category:', selectedCategoryId);
  console.log('Parsed tags:', parseTags(tagInput));
  console.log('Recipes in Redux:', recipes);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      !selectedCategoryId ||
      (recipe.categories &&
        recipe.categories.includes(String(selectedCategoryId)));

    const tagList = parseTags(tagInput);
    const matchesTags =
      tagList.length === 0 ||
      (recipe.tags &&
        tagList.some((tag) => recipe.tags.includes(tag)));

    return matchesCategory && matchesTags;
  });

  console.log('Filtered Recipes:', filteredRecipes);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">All Recipes</h2>

      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={selectedCategoryId}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search tags (comma or space separated)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <button className="btn btn-success w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="row">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">Error: {error}</p>
        ) : filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div className="col-md-4 mb-4" key={recipe._id}>
              <RecipeCard recipe={recipe} />
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
}
