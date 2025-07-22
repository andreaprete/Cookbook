// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './features/user/userSlice';
import { fetchBookmarks } from './features/bookmarks/bookmarksSlice';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import MyRecipes from './pages/MyRecipes';
import Bookmarks from './pages/Bookmarks';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
    dispatch(fetchBookmarks()); 
  }, [dispatch]);

  return (
    <Router>
      <Navbar /> {/* 👈 Added the Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/my" element={<MyRecipes />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </Router>
  );
}

export default App;
