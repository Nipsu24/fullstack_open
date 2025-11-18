import { render, screen } from '@testing-library/react'
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