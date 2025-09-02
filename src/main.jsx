import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./Home.jsx";
import BlogList from "./pages/BlogList.jsx";
import BlogDetails from "./pages/BlogDetails.jsx"; // new

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/:id" element={<BlogDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
