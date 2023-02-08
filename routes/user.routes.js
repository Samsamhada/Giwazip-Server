module.exports = (app) => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.post("/", users.create);
    router.post("/worker", users.createWithWorker);

    router.get("/", users.findAll);
    router.get("/:id", users.findOne);
    router.get("/room/:id", users.findOneWithRoom);

    router.put("/:id", users.update);

    router.delete("/:id", users.delete);

    app.use("/giwazip/users", router);
};
