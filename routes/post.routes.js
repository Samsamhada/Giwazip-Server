module.exports = (app) => {
    const posts = require("../controllers/post.controller.js");

    var router = require("express").Router();

    router.post("/", posts.create);

    router.get("/", posts.findAll);
    router.get("/:id", posts.findOne);
    router.get("/user/:id", posts.findOneWithUser);

    router.put("/:id", posts.update);

    app.use("/giwazip/posts", router);
};
