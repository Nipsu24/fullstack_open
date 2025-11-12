const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  const user = await User.findById(body.userId)
  
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  if (!Object.hasOwn(body, 'title') || !Object.hasOwn(body, 'url'))
    return response.status(400).json({error: "Missing fields in POST request"})
  
   const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findByIdAndDelete(request.params.id)
  if (blogToDelete)
    return response.status(204).end()
  else
    return response.status(404).json({error: "Blog could not be found"})
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const blogToUpdate = await Blog.findById(request.params.id)
  if (blogToUpdate) {
    blogToUpdate.likes = likes
    const savedBlog = await blogToUpdate.save()
    return response.status(200).json(savedBlog)
  }
  else
    return response.status(404).json( {error: "Blog could not be found"})
})


module.exports = blogsRouter