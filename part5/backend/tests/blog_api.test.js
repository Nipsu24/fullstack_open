const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')

const api = supertest(app)
describe('Blog API tests', () => {
  const initialBlogs = [
    {
      title: 'First Blog',
      author: 'Me me',
      url: 'fake-url.com',
      likes: 100
    },
    {
      title: 'Second Blog',
      author: 'You you',
      url: 'another-fake-url.com',
    },
  ]

  const thirdBlog = {
    title: 'Third Blog',
    author: 'We we',
    url: 'super-fake-url.com',
    likes: 400
  }

  const fourthBlog = {
    title: 'Third Blog',
    author: 'We we',
    likes: 400
  }

  const fifthBlog = {
    author: 'We we',
    url: 'super-fake-url.com',
    likes: 400
  }

  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(e => e.title)
    assert.strictEqual(titles.includes('First Blog'), true)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    const allHaveId = blogs.every(b => Object.hasOwn(b, 'id'))
    assert.strictEqual(allHaveId, true)
  })

  test('post request increases amount of blogs by 1', async () => {
    const startBlogs = await api.get('/api/blogs')
    const startLength = startBlogs.body.length

    await api.post('/api/blogs').send(thirdBlog)
    const endBlogs = await api.get('/api/blogs')
    const endLength = endBlogs.body.length
    assert.strictEqual(endLength, startLength + 1)
  })

  test('post request creates further blog with correct content', async () => {

    await api.post('/api/blogs').send(thirdBlog)
    const blogs = await api.get('/api/blogs')
    const createdBlog = blogs.body[2]

    assert.deepStrictEqual(
      { title: createdBlog.title, author: createdBlog.author, url: createdBlog.url, likes: createdBlog.likes },
      thirdBlog
    )
  })

  test('checks if likes field has value 0 if missing from the object', async () => {

    const blogs = await api.get('/api/blogs')
    assert.strictEqual(blogs.body[1].likes, 0)
  })

  test('post response with 400 when url is missing in request', async () => {

    const response = await api.post('/api/blogs').send(fourthBlog)
    assert.deepStrictEqual( response.body,{ error: 'Missing fields in POST request' })
  })

  test('post response with 400 when title is missing in request', async () => {

    const response = await api.post('/api/blogs').send(fifthBlog)
    assert.deepStrictEqual( response.body,{ error: 'Missing fields in POST request' })
  })

  test('deletes blog from list of blogs successfully', async () => {

    const initialBlogs = await api.get('/api/blogs')
    const blogToDelete = initialBlogs.body[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
    const blogsAfterDelete = await api.get('/api/blogs')
    assert.strictEqual(blogsAfterDelete.body.length, initialBlogs.body.length - 1)

    const ids = blogsAfterDelete.body.map(b => b.id)
    assert.strictEqual(ids.includes(blogToDelete.id), false)
  })

  test('returns error 404 when trying to delete not existing blog', async () => {
    const nonExistingId = '507f1f77bcf86cd799439011'
    const response = await api.delete(`/api/blogs/${nonExistingId}`).expect(404)
    assert.deepStrictEqual(response.body, { error: 'Blog could not be found' })

  })

  test('Alters likes amount with PUT request', async () => {
    const blogs = await api.get('/api/blogs')
    const blogToUpdate = blogs.body[0]
    const initialLikes = blogToUpdate.likes

    const newLikes = initialLikes + 100
    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send( { likes: newLikes })
      .expect(200)
    assert.strictEqual(updatedBlog.body.likes, newLikes)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})