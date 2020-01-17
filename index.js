const express = require('express');
const app = express();
const port = 3001;
const morgan = require('morgan');
const api = require('./api/api');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', api);

app.listen(port, () =>
  console.log(`API Dashboard server is listening on port ${port}.`)
);

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});
