module.exports = (app) => {
    const userrooms = require("../controllers/userroom.controller.js");

    var router = require("express").Router();

    router.post("/", userrooms.create);

    router.get("/", userrooms.findAll);

    router.get("/:id", userrooms.findOne);

    app.use("/giwazip/user-rooms", router);
};
