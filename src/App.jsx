import React, { useState } from 'react';
import Home from './Home';
import BlogList from './pages/BlogList';
import BlogForm from './components/BlogForm';

function App() {
  const [blogs, setBlogs] = useState([
    { id: 1, title: 'First Blog', author: 'Alice', context: 'Sample context' },
    { id: 2, title: 'Second Blog', author: 'Bob', context: 'Another context' }
  ]);

  const addBlog = (blog) => {
    setBlogs([blog, ...blogs]);
  };

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
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