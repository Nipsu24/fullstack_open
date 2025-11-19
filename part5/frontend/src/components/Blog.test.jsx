import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog summary', () => {
  const mockUser = {
    username: 'testuser'
  }

  const blog = {
    title: 'Great ways to test react components',
    author: 'me',
    url: 'fake-url',
    likes: '400',
  }

  const mockHandler = () => {}

  const { container } = render(
    <Blog
      blog={blog}
      user={mockUser}
      handleBlogUpdate={mockHandler}
      handleDeleteBlog={mockHandler}
    />
  )

  const div = container.querySelector('.blogSummary')
  expect(div).toHaveTextContent('Great ways to test react components')
  expect(div).toHaveTextContent('me')

  const detailDiv = container.querySelector('.blogDetail')
  expect(detailDiv).not.toBeVisible()

})

test('clicking view button shows blog details', async () => {
  const mockUser = {
    username: 'testuser'
  }

  const blog = {
    title: 'Great ways to test react components',
    author: 'me',
    url: 'fake-url',
    likes: '400',
  }

  const mockHandler = () => {}

  const { container } = render(
    <Blog
      blog={blog}
      user={mockUser}
      handleBlogUpdate={mockHandler}
      handleDeleteBlog={mockHandler}
    />
  )

  const testUser = userEvent.setup()
  const button = screen.getByText('view')
  await testUser.click(button)

  const detailDiv = container.querySelector('.blogDetail')
  expect(detailDiv).toBeVisible()
  expect(detailDiv).toHaveTextContent('fake-url')
  expect(detailDiv).toHaveTextContent('400')
})

test('clicking the button twice calls event handler twice', async () => {
  const mockUser = {
    username: 'testuser'
  }

  const blog = {
    title: 'Great ways to test react components',
    author: 'me',
    url: 'fake-url',
    likes: '400',
  }

  const mockHandler = vi.fn()

  const { container } = render(
    <Blog
      blog={blog}
      user={mockUser}
      handleBlogUpdate={mockHandler}
      handleDeleteBlog={mockHandler}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})