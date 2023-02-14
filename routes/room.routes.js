module.exports = (app) => {
    const rooms = require("../controllers/room.controller.js");

    var router = require("express").Router();

    router.post("/", rooms.create);
    router.post("/category", rooms.createWithUserRoomAndCategory);

    router.get("/", rooms.findAll);
    router.get("/:id", rooms.findOne);
    router.get("/category/:id", rooms.findOneWithCategory);
    router.get("/post/:id", rooms.findOneWithPost);
    router.get("/category-post/:id", rooms.findOneWithCategoryAndPost);
    router.get("/post-category/:id", rooms.findOneWithPostAndCategory);
    router.get("/user/:id", rooms.findOneWithUser);

    router.put("/:id", rooms.update);

    router.delete("/:id", rooms.delete);

    app.use("/giwazip/rooms", router);
};
