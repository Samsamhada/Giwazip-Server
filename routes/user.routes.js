module.exports = (app) => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.post("/", users.create);

    router.get("/", users.findAll);
    router.get("/:id", users.findOne);
    router.get("/room/:id", users.findOneWithRoom);

    router.put("/:id", users.update);

    app.use("/giwazip/users", router);
};
