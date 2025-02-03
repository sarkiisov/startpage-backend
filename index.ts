import express from 'express';
import got from 'got';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
