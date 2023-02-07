module.exports = (app) => {
    const admins = require("../controllers/admin.controller.js");

    var router = require("express").Router();

    router.post("/", admins.create);

    router.get("/", admins.findAll);
    router.get("/:id", admins.findOne);

    app.use("/giwazip/admins", router);
};