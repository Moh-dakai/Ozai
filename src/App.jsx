import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

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

  // Backend OAuth start endpoint (open the provider flow)
  const BACKEND_OAUTH = "https://ozai-9gqx.onrender.com/auth/google";

  return (
    <div className="App">
      <nav className="navbar">
        <h1>
          <span className="brand-mark" />
          LOBO
        </h1>

        {/* Use client-side Links (relative) - prevents jumping to another host */}
        <div className="links">
          <Link to="/blogs" className="btn">
            Blogs
          </Link>
          <Link to="/myblogs" className="btn">
            My Blogs
          </Link>
          {!token ? (
            // This intentionally points at your backend OAuth start endpoint (absolute)
            <a className="login-btn btn" href={BACKEND_OAUTH}>
              Login with Google
            </a>
          ) : (
            <>
              <span style={{ marginLeft: 8 }}>Hi, {userName}</span>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;