module.exports = (app) => {
    const statuses = require("../controllers/status.controller.js");

    var router = require("express").Router();

    router.post("/", statuses.create);

    router.get("/", statuses.findAll);

    app.use("/giwazip/statuses", router);
};
