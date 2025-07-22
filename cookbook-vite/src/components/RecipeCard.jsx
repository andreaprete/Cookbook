import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import { useSelector } from 'react-redux';
import { selectSavedRecipeIds } from '../features/user/selectors';

export default function RecipeCard({ recipe }) {
  const savedRecipes = useSelector(selectSavedRecipeIds);
  const isBookmarked = savedRecipes.includes(recipe._id);

  const averageRating = recipe.rating?.length
    ? (
        recipe.rating.reduce((sum, r) => sum + (r.value || 0), 0) / recipe.rating.length
      ).toFixed(1)
    : 'N/A';

  const rawHref = recipe.href && recipe.href.includes('localhost:3010')
    ? recipe.href.replace('3010', '3030')
    : recipe.href;

  const defaultImage = "/pic.jpeg";
  const imageUrl = rawHref?.trim() ? rawHref : defaultImage;

  return (
    <div className="card h-100">
      <img
        src={imageUrl}
        className="card-img-top"
        alt={recipe.name}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImage;
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{recipe.name}</h5>
        <p className="card-text"><strong>Time:</strong> {recipe.time} min</p>

        <div className="mb-1">
          {recipe.rating?.length ? (
            <>
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`me-1 ${i < Math.round(averageRating) ? 'text-warning' : 'text-secondary'}`}
                >
                  &#9733;
                </span>
              ))}
              <small className="text-muted ms-2">({recipe.rating.length})</small>
            </>
          ) : (
            <small className="text-muted">No ratings yet</small>
          )}
        </div>

        <Link to={`/recipe/${recipe._id}`} className="btn btn-primary mt-2">
          View Details
        </Link>
        <BookmarkButton recipeId={recipe._id} isBookmarked={isBookmarked} />
      </div>
    </div>
  );
}
