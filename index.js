const express = require("express");
const cors = require("cors");
const formidableMiddleware = require('express-formidable'); 
const routerApi = require("./routes");
const { config } = require('./config/config');
const debug = require("debug")("app:app");

const {logErrors, boomErrorHandler, errorHandler } = require('./middlewares/error.handler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(formidableMiddleware({uploadDir:config.tmpDir}));

const whitelist = ["http://localhost:8080"];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("no permitido"));
    }
  },
};

app.use(cors(options));

require('./utils/auth');

app.get("/", (req, res) => {
  res.send("SUIN");
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  debug('Mi port: ', port);
});
