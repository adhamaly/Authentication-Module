require("make-promises-safe");
require("express-async-errors");

const compression = require("compression");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const AbstractError = require("../errors/abstract-error");

const userAPIs = require("../User/routes/user-APIs");

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

module.exports = (app) => {
  app.use(compression({ filter: shouldCompress }));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: process.env.CLIENT_BASE_URL,
      credentials: true,
      exposedHeaders: "Content-Range",
    })
  );

  app.use("/api/v1/user", userAPIs);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // res.locals.message = typeof err === 'object' ? err.message : err
    res.locals.message = err;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    const frame = err.stack.split("\n")[1];
    const lineNumber = frame.split(":")[1];
    const path = frame.split(":")[0].split("/");
    const file = path[path.length - 1];
    const functionName = frame.split(" ")[5];

    console.info(
      `${err.statusCode || 500} - ${
        err.name
      } - ${file}:${functionName}:${lineNumber} - ${err.message} - ${
        req.originalUrl
      } - ${req.method} - ${req.ip}`
    );

    if (
      process.env.NODE_ENV !== "production" ||
      !err.statusCode ||
      err.statusCode === 500
    ) {
      console.trace(err.stack);
    }

    if (err instanceof AbstractError) {
      return res
        .status(err.statusCode)
        .send({ success: false, errors: err.serializeErrors().flat() });
    }

    res.status(500).send({
      success: false,
      errors: [
        {
          message: "Something went wrong",
        },
      ],
    });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((req, res, next) => {
    // eslint-disable-line no-unused-vars
    const ERR_MSG = `NotFound: there is no handler for this url`;
    console.info(
      `404 - ${ERR_MSG} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );

    res.status(404).send({
      success: false,
      errors: [
        {
          message: ERR_MSG,
        },
      ],
    });
  });
};
