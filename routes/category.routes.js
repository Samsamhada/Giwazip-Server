module.exports = (app) => {
    const categories = require("../controllers/category.controller.js");

    var router = require("express").Router();

    router.post("/", categories.create);

    app.use("/giwazip/categories", router);
};
