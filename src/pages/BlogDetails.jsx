import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { showToast } from "../utils/toast";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`https://ozai-9gqx.onrender.com/blogs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        showToast("Blog loaded", "info", 1800);
      })
      .catch((err) => {
        console.error(err);
        showToast("Failed to load blog", "error", 3500);
      });
  }, [id]);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sept","Oct","Nov","Dec"
    ];
    const month = months[d.getMonth()] || d.toLocaleString(undefined, { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return `${month} ${day}, ${year} – ${time}`;
  };

  if (!blog) return <p>Loading blog...</p>;

  return (
    <div className="blog-details">
      <h2>{blog.title}</h2>
      <p><strong>Author:</strong> {blog.author}</p>
      <p><small>{formatDate(blog.createdAt)}</small></p>
      <p>{blog.content}</p>
      <Link to="/blogs">⬅ Back to Blogs</Link>
    </div>
  );
};

export default BlogDetails;
// ...existing code...