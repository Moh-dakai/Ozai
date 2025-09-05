import { useEffect, useState } from "react";
import BlogList from "./BlogList"; // reuse the BlogList component

const API_URL = "https://ozai-9gqx.onrender.com/blogs";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("https://ozai-9gqx.onrender.com/myblogs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user blogs:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id));
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog");
    }
  };

  const handleEdit = (blog) => {
    // Minimal: navigate to /new and let BlogsPage handle editing if you add that flow.
    // For now just log — BlogsPage provides editing inline.
    console.log("Edit requested:", blog);
    alert("Edit flow not implemented here. Use Blogs page to edit.");
  };

  if (loading) return <p>Loading your blogs...</p>;
  if (!blogs.length) return <p>You haven’t written any blogs yet.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Blogs</h2>
      <BlogList blogs={blogs} onDeleteBlog={handleDelete} onEditBlog={handleEdit} />
    </div>
  );
};

export default MyBlogs;