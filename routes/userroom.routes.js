module.exports = (app) => {
    const userrooms = require("../controllers/userroom.controller.js");

    var router = require("express").Router();

    router.post("/", userrooms.create);

    // router.get("/", users.findAll);

    // router.get("/:id", users.findOne);

    // router.put("/:id", users.update);

    // router.delete("/:id", users.delete);

    app.use("/giwazip/userrooms", router);
};
