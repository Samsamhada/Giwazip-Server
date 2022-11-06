module.exports = (app) => {
    const rooms = require("../controllers/room.controller.js");

    var router = require("express").Router();

    router.get("/", rooms.findAll);
    app.use("/giwazip/rooms", router);
};
