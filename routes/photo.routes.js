const imageUploader = require("../utils/s3.utils.js");

module.exports = (app) => {
    const photos = require("../controllers/photo.controller.js");

    var router = require("express").Router();

    router.get("/", photos.findAll);

};
