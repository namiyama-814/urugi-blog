const { Hono } = require('hono');
const getPosts = require('../api/posts');
const { getPostDetail, getPostImageStream } = require('../api/blog');

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
  const result = await getPostImageStream(id);
  return c.json(result.data, result.status);
});

module.exports = app;