module.exports = (app) => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.post("/", users.create);

    router.get("/", users.findAll);

    router.get("/:id", users.findOne);

    router.put("/:id", users.update);

    router.get("/worker", users.findAllWithWorker);

    router.get("/worker/:id", users.findOneWithWorker);

    router.get("/room", users.findAllRoom);

    app.use("/giwazip/users", router);
};
