module.exports = (app) => {
    const posts = require("../controllers/post.controller.js");

    var router = require("express").Router();

    router.post("/", posts.create);

    router.get("/", posts.findAll);

    router.get("/:id", posts.findOne);

    router.get("/room/:id", posts.findByRoomID);

    router.get("/category/:category", posts.findByCategory);

    router.put("/:id", posts.update);

    router.delete("/:id", posts.delete);

    app.use("/giwazip/posts", router);
};
