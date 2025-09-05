// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./Home.jsx";
import BlogList from "./pages/BlogList.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import AuthHandler from "./pages/AuthHandler.jsx";
import MyBlogs from "./pages/MyBlogs.jsx";
import BlogForm from "./components/BlogForm.jsx";
import BlogsPage from "./pages/BlogsPage.jsx";
import PrivateRoute from "./PrivateRoute";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/:id" element={<BlogDetails />} />
          <Route path="auth" element={<AuthHandler />} />
          <Route path="myblogs" element={<MyBlogs />} />
          <Route path="new" element={
            <PrivateRoute>
              <BlogForm />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
