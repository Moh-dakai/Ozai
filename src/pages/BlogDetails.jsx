import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`https://ozai-9gqx.onrender.com/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!blog) return <p>Loading blog...</p>;

  return (
    <div className="blog-details">
      <h2>{blog.title}</h2>
      <p><strong>Author:</strong> {blog.author}</p>
      <p><small>{new Date(blog.createdAt).toLocaleString()}</small></p>
      <p>{blog.content}</p>
      <Link to="/blogs">⬅ Back to Blogs</Link>
    </div>
  );
};

export default BlogDetails;
