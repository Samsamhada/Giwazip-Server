module.exports = (app) => {
    const notices = require("../controllers/notice.controller.js");

    var router = require("express").Router();

    router.post("/", notices.create);

    router.get("/", notices.findAll);
    router.get("/:id", notices.findOne);

    router.put("/:id", notices.update);

    app.use("/giwazip/notices", router);
};
