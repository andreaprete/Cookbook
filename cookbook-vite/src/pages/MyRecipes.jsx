import { useEffect, useState } from 'react';
import axios from '../axios';
import { useSelector } from 'react-redux';
import RecipeCard from '../components/RecipeCard';

export default function MyRecipes() {
  const user = useSelector((state) => state.user.currentUser);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchMyRecipes();
  }, [user]);

  const fetchMyRecipes = async () => {
    try {
      const res = await axios.get('/cookbook/user/recipe', { withCredentials: true });
      setMyRecipes(res.data);
      setLoading(false);
    } catch (err) {
      setError('❌ Failed to load your recipes');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await axios.delete(`/cookbook/delete/${id}`, { withCredentials: true });
      setMyRecipes((prev) => prev.filter((r) => r._id !== id));
      setMessage('✅ Recipe deleted!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to delete recipe');
    }
  };

  if (!user) {
    return (
        <div className="container mt-4">
        <h2>My Recipes</h2>
        <p>You need to log in to see your recipes.</p>
        </div>
    );
    }

  return (
    <div className="container mt-4">
      <h2>My Recipes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : myRecipes.length === 0 ? (
        <p>You haven't added any recipes yet.</p>
      ) : (
        <div className="row">
          {myRecipes.map((recipe) => (
            <div className="col-md-4 mb-4" key={recipe._id}>
              <div className="d-flex flex-column h-100">
                <RecipeCard recipe={recipe} />
                <button
                  onClick={() => handleDelete(recipe._id)}
                  className="btn btn-danger w-100 mt-2"
                  style={{ marginTop: 'auto' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
