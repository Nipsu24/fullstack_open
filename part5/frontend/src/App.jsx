import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch (error) {
      console.error('Error creating blog:', error)
      console.log('error:', error.response?.data)
      setErrorMessage('Failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlogLikes = async (blogObject) => {
    try {
      blogObject.likes = blogObject.likes + 1
      const updatedBlog = await blogService.update(blogObject)
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    }
    catch (error) {
      setErrorMessage('Failed to like blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)) {
      try {
        await blogService.remove(blogObject)
        setBlogs(blogs.filter( b => b.id !== blogObject.id ))
      }
      catch (error) {
        setErrorMessage('Failed to delete blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const postedBlogs = () => {
    const blogsSorted = blogs.sort((a, b) => b.likes - a.likes)
    return (
      <div>
        <h2>blogs</h2>
        {blogsSorted.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} handleBlogUpdate={updateBlogLikes} handleDeleteBlog={deleteBlog} />
        )}
      </div>
    )
  }

  const logout = () => (
    <div>
      <button onClick={handleLogout} type="submit">logout</button>
    </div>
  )

  return (
    <div>
      {errorMessage && (
        <div style={{ color: 'red', border: '2px solid red', padding: '10px', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div style={{ color: 'green', border: '2px solid green', padding: '10px', marginBottom: '10px' }}>
          {successMessage}
        </div>
      )}

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {postedBlogs()}
          {logout()}
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} ></BlogForm>
          </Togglable>
        </div>
      )}
    </div>
  )
}

export default App