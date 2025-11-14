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

const mostBlogs = (blogs) => {
  if (blogs.length === 0)
    return null

  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    return counts;
  }, {});

  const [author, blogsCount] = Object.entries(authorCounts)
    .reduce((max, current) => (current[1] > max[1] ? current : max));
  
    return { author, blogs: blogsCount };
};


const mostLikes = (blogs) => {
  if (blogs.length === 0)
    return null

  const likesCounts = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes;
    return likes;
  }, {});

  const [author, likesCount] = Object.entries(likesCounts)
    .reduce((max, current) => (current[1] > max[1] ? current : max));
  
    return { author, likes: likesCount };
};

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}
