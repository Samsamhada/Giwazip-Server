module.exports = (app) => {
    const posts = require("../controllers/post.controller.js");

    var router = require("express").Router();

    router.post("/", posts.create);

    app.use("/giwazip/posts", router);
};
