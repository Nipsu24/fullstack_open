const dummy = (blogs) => {
  return (1);
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => 
    (sum + blog.likes)
  , 0);
  return total;
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) 
    return null
  return blogs.reduce((mostLiked, current) =>
    current.likes > mostLiked.likes ? current : mostLiked
  , blogs[0])
}

module.exports = {
  dummy, totalLikes, favouriteBlog
}
