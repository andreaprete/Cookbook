
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRecipe } from '../features/recipes/recipeSlice';
import { setUser } from '../features/user/userSlice'; // make sure this is imported

export default function RecipeDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.currentUser);
  const user = reduxUser ?? null;
  const reduxRecipe = useSelector((state) => state.recipes.selectedRecipe);
  const [localRecipe, setLocalRecipe] = useState(null);

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);
  const [message, setMessage] = useState('');
  const [ratingMessage, setRatingMessage] = useState('');
  const [selectedPortion, setSelectedPortion] = useState(1);

  // 🔄 Restore user from localStorage after refresh
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!reduxUser && stored) {
      try {
        dispatch(setUser(JSON.parse(stored)));
      } catch (e) {
        console.error('🚨 Failed to restore user from localStorage', e);
      }
    }
  }, [dispatch, reduxUser]);

  useEffect(() => {
    dispatch(fetchRecipe(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (reduxRecipe) {
      setLocalRecipe(reduxRecipe);
      setSelectedPortion(reduxRecipe.portion);
    }
  }, [reduxRecipe]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3030/cookbook/comment/recipe', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recipe: localRecipe._id, comment })
      });
      if (res.ok) {
        setMessage('✅ Comment submitted!');
        setComment('');
        dispatch(fetchRecipe(id));
      } else {
        const txt = await res.text();
        setMessage(`❌ ${txt}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong');
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const res = await fetch('http://localhost:3030/cookbook/rate/recipe', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recipe: localRecipe._id, rating })
      });

      if (res.ok) {
        setRatingMessage('✅ Rating submitted!');
        dispatch(fetchRecipe(id));
      } else {
        const txt = await res.text();
        setRatingMessage(`❌ ${txt}`);
      }
    } catch (err) {
      console.error(err);
      setRatingMessage('❌ Something went wrong');
    }
  };

  if (!localRecipe) return <p className="text-center mt-5">Loading...</p>;

  const scale = selectedPortion / localRecipe.portion;

  const averageRating = localRecipe.rating.length
    ? (
        localRecipe.rating.reduce((sum, r) => sum + r.value, 0) / localRecipe.rating.length
      ).toFixed(1)
    : null;

  const renderStars = (value, setFn = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        onClick={() => setFn && setFn(i + 1)}
        style={{ cursor: setFn ? 'pointer' : 'default' }}
        className={`${i < value ? 'text-warning' : 'text-secondary'} fs-5 me-1`}
      >
        &#9733;
      </span>
    ));
  };

  return (
    <div className="container my-4">
      <div className="row mb-4">
        <div className="col-md-6 position-relative">
          <div className="position-relative rounded overflow-hidden">
            <img
              src={localRecipe.href?.includes('localhost:3010') ? localRecipe.href.replace('3010', '3030') : localRecipe.href}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/pic.jpeg';
              }}
              alt={localRecipe.name}
              className="img-fluid rounded shadow-sm w-100"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
            <div className="position-absolute bottom-0 w-100 p-2 bg-dark bg-opacity-50 text-white">
              <h2 className="m-0">{localRecipe.name}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="bg-light p-3 rounded shadow-sm">
            <p><strong>👩‍🍳 Chef:</strong> {localRecipe.user?.firstname ?? 'undefined'} {localRecipe.user?.lastname ?? ''}</p>
            <p><strong>⏱ Time:</strong> {localRecipe.time} min</p>
            <p><strong>🍽️ Portions:</strong> {localRecipe.portion}</p>
            <p><strong>🏷 Tags:</strong><br />
              {localRecipe.tags?.map((tag, i) => (
                <span key={i} className="badge bg-secondary me-2 mb-1">{tag}</span>
              )) || 'None'}
            </p>
            <div className="my-2">
              {averageRating ? renderStars(Math.round(averageRating)) : 'No ratings yet'}
              <p className="mt-1 small">{averageRating ? `${averageRating}/5` : ''}</p>
            </div>
            {localRecipe.nutritionalValues.map((nv, idx) => (
              <div key={idx} className="small">
                🔥 {nv.kcal} kcal &nbsp; | &nbsp;
                💪 {nv.protein}g Protein &nbsp; | &nbsp;
                🧈 {nv.fat}g Fat &nbsp; | &nbsp;
                🍞 {nv.carbohydrates}g Carbs
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4>📦 Ingredients</h4>
        <div className="d-flex align-items-center mb-2">
          <label className="me-2 mb-0">Portions:</label>
          <input
            type="number"
            min={1}
            className="form-control w-auto"
            value={selectedPortion}
            onChange={(e) => setSelectedPortion(Number(e.target.value))}
          />
        </div>
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Ingredient</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {localRecipe.ingredients.map((i, idx) => (
              <tr key={idx}>
                <td>{i.ingredient}</td>
                <td>{(i.amount * scale).toFixed(2)} {i.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <h4>📋 Preparation</h4>
        <div className="bg-light rounded p-3 shadow-sm">
          <p className="mb-0">{localRecipe.directions}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4>💬 Comments</h4>
        {localRecipe.comments.length ? (
          <ul className="list-group">
            {localRecipe.comments.map((c, i) => (
              <li key={i} className="list-group-item">
                <strong>{c.user?.firstname ?? 'User'} {c.user?.lastname ?? ''}</strong>: {c.comment}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No comments yet.</p>
        )}
      </div>

      <div className="mb-4">
        <h4>📝 Leave a Comment</h4>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="border p-3 rounded bg-white shadow-sm mb-3">
            <textarea
              className="form-control mb-2"
              rows="2"
              placeholder="Your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <div className="text-end">
              <button className="btn btn-outline-primary">Submit Comment</button>
            </div>
            {message && <p className="mt-2 text-muted">{message}</p>}
          </form>
        ) : (
          <p className="text-muted">You must be logged in to comment.</p>
        )}

        <h4 className="mt-4">⭐ Submit Your Rating</h4>
      {user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("🚀 Submit clicked!");
            console.log("👤 Current user ID:", user._id);
            console.log("📊 All ratings:", localRecipe.rating);

            const existingRating = localRecipe.rating.find((r) => {
              const rUserId = typeof r.user === 'object' ? r.user._id : r.user;
              return rUserId?.toString() === user._id;
            });

            console.log("🕵️ Existing rating found:", existingRating);

            if (existingRating) {
              const confirmed = window.confirm(
                "⚠️ You already rated this recipe. Submitting again will override your previous rating. Do you want to continue?"
              );
              if (!confirmed) return;
            }
            handleRatingSubmit();
          }}
          className="border p-3 rounded bg-white shadow-sm"
        >
          <div>{renderStars(rating, setRating)}</div>
          <div className="text-end mt-2">
            <button className="btn btn-outline-success">Submit Rating</button>
          </div>
          {ratingMessage && <p className="mt-2 text-muted">{ratingMessage}</p>}
        </form>
      ) : (
        <p className="text-muted">You must be logged in to rate.</p>
      )}
      </div>
    </div>
  );
}
