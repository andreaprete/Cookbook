import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchBookmarks = createAsyncThunk('bookmarks/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/cookbook/saved', { withCredentials: true });
    return res.data.savedRecipes.map(r => r._id);
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch bookmarks');
  }
});

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    recipeIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    addBookmark: (state, action) => {
      state.recipeIds.push(action.payload);
    },
    removeBookmark: (state, action) => {
      state.recipeIds = state.recipeIds.filter(id => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.recipeIds = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addBookmark, removeBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
