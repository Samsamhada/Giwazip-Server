module.exports = (app) => {
    const userrooms = require("../controllers/userroom.controller.js");

    var router = require("express").Router();

    router.post("/", userrooms.create);

    router.put("/", userrooms.update);

    app.use("/giwazip/user-rooms", router);
};
