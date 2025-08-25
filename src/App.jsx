import React, { useState, useEffect } from 'react';
import Home from './Home';
import BlogList from './pages/BlogList';
import BlogForm from './components/BlogForm';

function App() {
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs from backend
  useEffect(() => {
    fetch('http://localhost:5000/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data));
  }, []);

  // Add blog via backend
  const addBlog = (blog) => {
    fetch('http://localhost:5000/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: blog.title,
        author: blog.author,
        content: blog.context // context from frontend maps to content in backend
      })
    })
      .then(res => res.json())
      .then(newBlog => setBlogs([newBlog, ...blogs]));
  };

  // Delete blog via backend
  const deleteBlog = (id) => {
    fetch(`http://localhost:5000/blogs/${id}`, {
      method: 'DELETE'
    })
      .then(() => setBlogs(blogs.filter(blog => blog._id !== id)));
  };

  return (
    <div className="App">
      <Home />
      <BlogForm onAddBlog={addBlog} />
      <BlogList blogs={blogs} onDeleteBlog={deleteBlog} />
    </div>
  );
}

export default App;