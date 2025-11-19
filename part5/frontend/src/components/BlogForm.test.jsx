import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls event handler with correct details when creating new blog', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(
    <BlogForm
      createBlog={createBlog}
    />
  )

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'A new blog')
  await user.type(authorInput, 'Famous blogger')
  await user.type(urlInput, 'fake-url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('A new blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Famous blogger')
  expect(createBlog.mock.calls[0][0].url).toBe('fake-url')
})