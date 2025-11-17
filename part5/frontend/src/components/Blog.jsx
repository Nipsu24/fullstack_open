import { useState } from 'react'

const Blog = ({ blog, handleBlogUpdate }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const showViewButtonStyle = { display: visible ? 'none' : '' }
  const showBlogDetailStyle = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div style={blogStyle}>
      <div style={showViewButtonStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showBlogDetailStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <div>{blog.url} </div>
        <div>likes
          {blog.likes}
          <button onClick={() => handleBlogUpdate(blog)}>like</button>
        </div>
        <div>{blog.user?.name}</div>
      </div>
    </div>
  )

}

export default Blog

