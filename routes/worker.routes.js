module.exports = (app) => {
    const workers = require("../controllers/worker.controller.js");

    var router = require("express").Router();

    router.post("/", workers.create);

    router.put("/", workers.update);

    app.use("/giwazip/workers", router);
};
