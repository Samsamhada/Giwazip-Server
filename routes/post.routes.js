const imageUploader = require("../utils/s3.utils.js");

module.exports = (app) => {
    const posts = require("../controllers/post.controller.js");

    var router = require("express").Router();

    router.post("/", posts.create);
    router.post(
        "/photo",
        imageUploader.array("files", 5),
        posts.createWithPhotos
    );

    router.get("/", posts.findAll);
    router.get("/:id", posts.findOne);
    router.get("/user/:id", posts.findOneWithUser);

    router.put("/:id", posts.update);

    router.delete("/:id", posts.delete);

    app.use("/giwazip/posts", router);
};
