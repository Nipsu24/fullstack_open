import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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

  const handleCreate = async event => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({ title, author, url} )
      setBlogs([...blogs, newBlog])
      setTitle('')
      setAuthor('')
      setUrl('')
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
    }
    catch (error) {
      console.error('Error creating blog:', error)
      console.log("error:", error.response?.data)
      setErrorMessage('Failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
    }, 5000)
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

  const blogForm = () => (
    <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
  )

  const logoutForm = () => (
    <div>
      <button onClick={handleLogout} type="submit">logout</button>
    </div>
  )

  const createForm = () => (
    <div>
    <form onSubmit={handleCreate}>
      <div>
        <label>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
      <label>
        url
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </label>
    </div>
      <button type="submit">create</button>
    </form>
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
        {blogForm()}
        {logoutForm()}
        <h2>create new</h2>
        {createForm()}
      </div>
    )}
    </div>
  )
}

export default App