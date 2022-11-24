const imageUploader = require("../utils/s3.utils.js");

module.exports = (app) => {
    const photos = require("../controllers/photo.controller.js");

    var router = require("express").Router();

    router.post("/", imageUploader.single("photo"), photos.create);

    router.get("/", photos.findAll);

    router.get("/:id", photos.findOne);

    router.get("/post/:id", photos.findByPostID);

    router.put("/:id", photos.update);

    router.delete("/:id", photos.delete);

    app.use("/giwazip/photos", router);
};
