module.exports = (app) => {
    const workers = require("../controllers/worker.controller.js");

    var router = require("express").Router();

    router.get("/", workers.findAll);
    console.log("worker.routes.js router: " + router);

    app.use("/api/workers", router);
};
