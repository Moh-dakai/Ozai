import React, { useState } from 'react';

const BlogForm = ({ onAddBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [context, setContext] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !context) return;
    onAddBlog({
      id: Date.now(),
      title,
      author,
      context
    });
    setTitle('');
    setAuthor('');
    setContext('');
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
      />
      <textarea
        placeholder="Context"
        value={context}
        onChange={e => setContext(e.target.value)}
        rows={4}
      />
      <button type="submit">Add Blog</button>
    </form>
  );
};

export default BlogForm;