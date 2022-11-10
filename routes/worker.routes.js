module.exports = (app) => {
    const workers = require("../controllers/worker.controller.js");

    var router = require("express").Router();

    router.post("/", workers.create);

    /**
     * @swagger
     * /workers:
     *   get:
     *     summary: 모든 업자 정보 조회
     *     tags: [Worker]
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    router.get("/", workers.findAll);

    router.get("/:id", workers.findOne);

    router.put("/:id", workers.update);

    router.delete("/:id", workers.delete);

    app.use("/giwazip/workers", router);
};
