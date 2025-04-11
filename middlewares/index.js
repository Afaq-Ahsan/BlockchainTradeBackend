const express = require("express");

const errorMiddleware = require("./error.middleware");
const notFoundMiddleware = require("./404.middleware");

module.exports.applyMiddlewares = (app) => {
  // app.disable("x-powered-by");

  // app.use(express.static("public"));

  // if (process.env.NODE_ENV !== "production") {
  //   app.use(
  //     "auth/api-docs",
  //     swaggerUi.serve,
  //     swaggerUi.setup(swaggerDocument, {
  //       customCss: ".swagger-ui .topbar { display: none }",
  //       customSiteTitle: `Greenpad Docs`,
  //       customfavIcon: "/images/favicon.png",
  //     })
  //   );
  // }

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));

  // app.use(
  //   morgan(":method :url :status :res[content-length] - :response-time ms")
  // );
};

module.exports.applyErrorMdiddlewares = (app) => {
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
};
