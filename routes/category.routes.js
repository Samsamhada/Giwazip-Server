module.exports = (app) => {
    const categories = require("../controllers/category.controller.js");

    var router = require("express").Router();

    router.post("/", categories.create);

    router.get("/", categories.findAll);
    router.get("/:id", categories.findOne);
    router.get("/post/:id", categories.findOneWithPost);

    router.put("/:id", categories.update);

    app.use("/giwazip/categories", router);
};
