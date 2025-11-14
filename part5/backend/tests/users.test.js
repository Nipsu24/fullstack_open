const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const User = require('../models/user')

const api = supertest(app)


describe('Post invalid users tests', () => {
   const userFalsePass = {
    name: "falsePass",
    username: "falsePass",
    password: "se"
  }

    const userFalseUname = {
    name: "falsePass",
    username: "fa",
    password: "secret"
  }

    const userNameInUse = {
    name: "falsePass",
    username: "NewUser",
    password: "secret"
  }
  
  test('post response with 400 when password is invalid', async () => {
    const initialUsers = await api.get('/api/users')
    const response = await api.post('/api/users')
    .send(userFalsePass)
    .expect(400)
    assert.deepStrictEqual( response.body,{ error: "Username and password require at least 3 characters" })
    const userAtEnd = await api.get('/api/users')
    assert.strictEqual(userAtEnd.body.length, initialUsers.body.length)
  })

  test('post response with 400 when username is too short', async () => {
    const initialUsers = await api.get('/api/users')
    const response = await api.post('/api/users')
    .send(userFalseUname)
    .expect(400)
    assert.deepStrictEqual( response.body,{ error: "Username and password require at least 3 characters" })
    const userAtEnd = await api.get('/api/users')
    assert.strictEqual(userAtEnd.body.length, initialUsers.body.length)
  })

  test('post response with 400 when username is already used', async () => {
    const initialUsers = await api.get('/api/users')
    const response = await api.post('/api/users')
    .send(userNameInUse)
    .expect(400)
    assert.deepStrictEqual( response.body,{ error: 'expected `username` to be unique' })
    const userAtEnd = await api.get('/api/users')
    assert.strictEqual(userAtEnd.body.length, initialUsers.body.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})