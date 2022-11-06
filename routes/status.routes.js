module.exports = (app) => {
    const statuses = require("../controllers/status.controller.js");

    var router = require("express").Router();

    router.post("/", statuses.create);

    router.get("/", statuses.findAll);

    router.get("/:id", statuses.findOne);

    router.get("/room/:id", statuses.findByRoomID);

    router.put("/:id", statuses.update);

    router.delete("/:id", statuses.delete);

    app.use("/giwazip/statuses", router);
};
