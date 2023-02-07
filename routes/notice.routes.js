module.exports = (app) => {
    const notices = require("../controllers/notice.controller.js");

    var router = require("express").Router();

    router.post("/", notices.create);

    router.get("/", notices.findAll);
    router.get("/:id", notices.findOne);

    app.use("/giwazip/notices", router);
};
