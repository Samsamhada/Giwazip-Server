module.exports = (app) => {
    const rooms = require("../controllers/room.controller.js");

    var router = require("express").Router();

    router.post("/", rooms.create);

    router.get("/", rooms.findAll);

    router.get("/:id", rooms.findOne);

    router.get("/worker/:id", rooms.findByWorkerID);

    router.get("/invite_code/:inviteCode", rooms.findByInviteCode);

    router.put("/:id", rooms.update);

    router.put("/invite_code/:inviteCode", rooms.updateClientNumber);

    router.delete("/:id", rooms.delete);

    app.use("/giwazip/rooms", router);
};
