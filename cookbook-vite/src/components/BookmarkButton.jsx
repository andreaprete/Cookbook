import { useDispatch, useSelector } from 'react-redux';
import axios from '../axios';
import { addBookmark, removeBookmark } from '../features/bookmarks/bookmarksSlice';

export default function BookmarkButton({ recipeId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const savedIds = useSelector((state) => state.bookmarks.recipeIds);

  const isBookmarked = savedIds.includes(recipeId);

  const handleToggle = async () => {
    try {
      if (!user) return alert('Please login to bookmark');

      if (isBookmarked) {
        await axios.put('/cookbook/save/delete/recipe', { recipe: recipeId }, { withCredentials: true });
        dispatch(removeBookmark(recipeId));
      } else {
        await axios.put('/cookbook/save/recipe', { recipe: recipeId }, { withCredentials: true });
        dispatch(addBookmark(recipeId));
      }
    } catch (err) {
      console.error('❌ Bookmark toggle failed', err);
    }
  };

  return (
    <button onClick={handleToggle} className="btn btn-outline-secondary mt-2">
      {isBookmarked ? 'Unbookmark' : 'Bookmark'}
    </button>
  );
}
