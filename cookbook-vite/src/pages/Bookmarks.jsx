// src/pages/Bookmarks.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../axios';
import RecipeCard from '../components/RecipeCard';
import { useMemo } from 'react';

export default function Bookmarks() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const user = useSelector((state) => state.user.currentUser);

  const uniqueRecipes = useMemo(() => {
  const seen = new Set();
  return recipes.filter((r) => {
      if (seen.has(r._id)) return false;
      seen.add(r._id);
      return true;
    });
  }, [recipes]);
  
  useEffect(() => {
    axios
      .get('/cookbook/saved/', { withCredentials: true })
      .then((res) => {
        setRecipes(res.data?.savedRecipes || []);
      })
      .catch((err) => {
        console.error(err);
        setError('❌ Failed to load bookmarks');
      });
  }, []);

  if (!user) {
    return (
        <div className="container mt-4">
        <h2>Bookmarked Recipes</h2>
        <p>You need to log in to see your bookmarks.</p>
        </div>
    );
 }

  return (
    <div className="container mt-4">
      <h2>Bookmarked Recipes</h2>
      {error && <p className="text-danger">{error}</p>}
      {recipes.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <div className="row">
          {uniqueRecipes.map(recipe => (
            <div className="col-md-4 mb-4" key={recipe._id}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
