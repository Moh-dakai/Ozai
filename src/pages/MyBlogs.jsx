// src/pages/MyBlogs.jsx
import { useEffect, useState } from "react";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/"; // redirect if not logged in
      return;
    }

    fetch("https://ozai-9gqx.onrender.com/myblogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching my blogs:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>⏳ Loading your blogs...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs yet.</p>
      ) : (
        <ul className="space-y-3">
          {blogs.map((blog) => (
            <li key={blog._id} className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="text-gray-600">{blog.content}</p>
              <small className="text-gray-400">Created {new Date(blog.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
