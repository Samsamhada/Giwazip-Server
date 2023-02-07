module.exports = (app) => {
    const notices = require("../controllers/notice.controller.js");

    var router = require("express").Router();

    router.post("/", notices.create);

    app.use("/giwazip/notices", router);
};
