import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/user/userSlice';

export default function Navbar() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await fetch('http://localhost:3030/logout', {
      method: 'POST',
      credentials: 'include',
    });
    dispatch(logoutUser());
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">CookBook</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/add">Add Recipe</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my">My Recipes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bookmarks">Bookmarks</Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item d-flex align-items-center">
                <span className="navbar-text me-2">👤 {user.email}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-primary btn-sm" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
