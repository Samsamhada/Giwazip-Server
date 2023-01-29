module.exports = (app) => {
    const rooms = require("../controllers/room.controller.js");

    var router = require("express").Router();

    router.post("/", rooms.create);

    router.get("/", rooms.findAll);

    router.get("/:id", rooms.findOne);

    app.use("/giwazip/rooms", router);
};
