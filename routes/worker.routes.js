module.exports = (app) => {
    const workers = require("../controllers/worker.controller.js");

    var router = require("express").Router();

    router.post("/", workers.create);

    router.get("/", workers.findAll);
    router.get("/:id", workers.findOne);

    router.put("/:id", workers.update);

    app.use("/giwazip/workers", router);
};
