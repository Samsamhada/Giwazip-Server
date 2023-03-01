module.exports = (app) => {
    const rooms = require("../controllers/room.controller.js");

    var router = require("express").Router();

    router.post("/", rooms.create);
    router.post("/category", rooms.createWithUserRoomAndCategory);

    router.get("/", rooms.findAll);
    router.get("/:id", rooms.findOne);
    router.get("/category-post/:id", rooms.findOneWithCategoryAndPost);
    router.get("/user/:id", rooms.findOneWithUser);
    router.get("/invite-code/:inviteCode", rooms.findOneByInviteCode);

    router.put("/:id", rooms.update);

    router.delete("/:id", rooms.delete);

    app.use("/giwazip/rooms", router);
};
