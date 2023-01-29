module.exports = (app) => {
    const categories = require("../controllers/category.controller.js");

    var router = require("express").Router();

    router.post("/", categories.create);

    router.get("/", categories.findAll);

    router.get("/:id", categories.findOne);

    app.use("/giwazip/categories", router);
};
