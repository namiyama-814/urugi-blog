const { Hono } = require('hono');
const getPosts = require('../api/posts');
const { getPostDetail, getPostImageStream } = require('../api/blog');
const { handleSearch } = require('../api/search');

const app = new Hono();

app.get('/', (c) => { return c.json({ message: 'Hello Urugi-Blog!' }) });

app.get('/posts', (c) => {
  const page = c.req.query('page') ?? '1';
  const res = getPosts(page, 10);
  return c.json(res, res.status);
});

app.get('/posts/:id', async (c) => {
  const id = c.req.param('id');
  const res = await getPostDetail(id);
  return c.json(res.data, res.status);
})

app.get('/posts/:id/stream', async (c) => {
  const id = c.req.param('id');
  const res = await getPostImageStream(id);
  return c.json(res.data, res.status);
});

app.get('/search', async (c) => {
  const q = c.req.query('q');
  const res = await handleSearch(q);
  return c.json(res.data, res.status);
});

module.exports = app;