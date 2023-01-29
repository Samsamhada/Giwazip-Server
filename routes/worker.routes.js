module.exports = (app) => {
    const workers = require("../controllers/worker.controller.js");

    var router = require("express").Router();

    router.post("/", workers.create);

    app.use("/giwazip/workers", router);
};
