module.exports = (app) => {
    const posts = require("../controllers/post.controller.js");

    var router = require("express").Router();

    router.post("/", posts.create);

    router.get("/", posts.findAll);

    router.get("/:id", posts.findOne);

    app.use("/giwazip/posts", router);
};
