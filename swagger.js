const express = require("express");
const router = express.Router();
const path = require("path");

const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    swaggerDefinition: {
        info: {
            title: "Swagger API Docs",
            version: "1.0.0",
            description: "Swagger test document",
        },
        host: "localhost:3000",
        basePath: "/giwazip",
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

module.exports = router;
