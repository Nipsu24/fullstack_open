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
})