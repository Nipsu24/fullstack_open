const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'New User',
        username: 'newTestUser',
        password: '123456'
      }
    })
     await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Second User',
        username: '2ndUser',
        password: '123456'
      }
    })
    
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locatorLogin = page.getByText('login')
    const locatorUserName = page.getByText('username')
    const locatorPassword = page.getByText('password')
    await expect(locatorLogin).toBeVisible()
    await expect(locatorUserName).toBeVisible()
    await expect(locatorPassword).toBeVisible()
  })
  
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('newTestUser')
      await page.getByRole('textbox').last().fill('123456')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('New User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('wrongUser')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('newTestUser')
      await page.getByRole('textbox').last().fill('123456')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('New User logged in')).toBeVisible()
    })
    
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await expect(page.getByRole('heading', { name: 'create new' })).toBeVisible()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('newBlog')
      await textboxes[1].fill('H.G. Wells')
      await textboxes[2].fill('fake-url')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('.blogSummary').getByText('newBlog H.G. Wells')).toBeVisible()
    })

    test('a new blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('newBlog')
      await textboxes[1].fill('H.G. Wells')
      await textboxes[2].fill('fake-url')
      await page.getByRole('button', { name: 'create' }).click()
      
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a new blog can be deleted', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('anothernewBlog')
      await textboxes[1].fill('newAuthor')
      await textboxes[2].fill('fake-url2')
      await page.getByRole('button', { name: 'create' }).click()
      
      await expect(page.locator('.blogSummary').getByText('anothernewBlog newAuthor')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('fake-url2')).toBeVisible()
      page.once('dialog', dialog => dialog.accept())
      await page.locator('.blogDetail').getByRole('button', { name: 'delete' }).click()
      await expect(page.locator('.blogSummary').getByText('newBlog H.G. Wells')).not.toBeVisible()
    })

    test('a new blog cannot be deleted by other user', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('anothernewBlog')
      await textboxes[1].fill('newAuthor')
      await textboxes[2].fill('fake-url2')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByRole('textbox').first().fill('2ndUser')
      await page.getByRole('textbox').last().fill('123456')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Second User logged in')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('delete')).not.toBeVisible()
    })
})    
  
})