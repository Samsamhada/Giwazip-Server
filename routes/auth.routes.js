module.exports = (app) => {
    const auth = require("../controllers/auth.controller.js");

    var router = require("express").Router();

    router.post("/", auth.appleAuth);

    app.use("/giwazip/apple_auth", router);
};
