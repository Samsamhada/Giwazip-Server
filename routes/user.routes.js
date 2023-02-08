module.exports = (app) => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.post("/", users.create);
    router.post("/sign-up", users.createWithWorker);
    router.post("/sign-in", users.findOneWithUserIdentifier);

    router.get("/", users.findAll);
    router.get("/:id", users.findOne);
    router.get("/room/:id", users.findOneWithRoom);

    router.put("/:id", users.update);

    router.delete("/:id", users.delete);

    app.use("/giwazip/users", router);
};
