module.exports = (app) => {
    const rooms = require("../controllers/room.controller.js");

    var router = require("express").Router();

    router.post("/", rooms.create);

    router.put("/:id", rooms.update);

    app.use("/giwazip/rooms", router);
};
