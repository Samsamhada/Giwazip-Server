module.exports = (app) => {
    const rooms = require("../controllers/room.controller.js");

    var router = require("express").Router();

    router.post("/", rooms.create);

    router.get("/", rooms.findAll);

    router.get("/:id", rooms.findOne);
    router.get("/category/:id", rooms.findOneWithCategory);

    router.put("/:id", rooms.update);

    app.use("/giwazip/rooms", router);
};
