const fs = require('fs');
const path = require('path');

function getPosts(page, limit) {
  const filePath = path.join(process.cwd(), 'posts.json');
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const allPosts = JSON.parse(fileData);

  const totalArticles = allPosts.length;
  const totalPages = Math.ceil(totalArticles / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    currentPage: page,
    hasMore: page < totalPages
  }
}

module.exports = getPosts;