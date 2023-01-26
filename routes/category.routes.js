module.exports = (app) => {
    const categories = require("../controllers/category.controller.js");

    var router = require("express").Router();

    router.post("/", categories.create);

    // router.get("/", statuses.findAll);

    // router.get("/:id", statuses.findOne);

    // router.get("/room/:id", statuses.findByRoomID);

    // router.put("/:id", statuses.update);

    // router.delete("/:id", statuses.delete);

    app.use("/giwazip/categories", router);
};
