module.exports = (app) => {
    const rooms = require("../controllers/room.controller.js");

    var router = require("express").Router();

    router.post("/", rooms.create);

    router.get("/", rooms.findAll);

    router.get("/:id", rooms.findOne);

    router.get("/worker/:id", rooms.findByWorkerID);

    router.put("/:id", rooms.update);

    router.delete("/:id", rooms.delete);

    app.use("/giwazip/rooms", router);
};
