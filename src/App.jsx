import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/new">New Blog</Link>
        <Link to="/blogs">All Blogs</Link>
        {token && <Link to="/myblogs">My Blogs</Link>}

        {token ? (
          <>
            <span>Hi, {userName}</span>
            <button onClick={handleLogout} className="ml-2 bg-red-500 px-2 rounded">
              Logout
            </button>
          </>
        ) : (
          <a href="https://ozai-9gqx.onrender.com/auth/google">Login with Google</a>
        )}
      </nav>

      {/* Page content */}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}


export default App;
