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

    /**
     * @swagger
     * /workers/{workerID}:
     *   get:
     *    summary:
     *    tags: [Worker]
     *    parameters:
     *      - name: workerID
     *        in: path
     *        requires: true
     *        description: workerID는 업자를 식별하기 위한 ID이다.
     *        schema:
     *          type: integer
     *    responses:
     *      200:
     *        description: OK
     *        content:
     *          application/json:
     *             schema:
     *               type: object
     *               properties:
     *                  workerID:
     *                    type: integer
     */
    router.get("/:id", workers.findOne);

    router.put("/:id", workers.update);

    router.delete("/:id", workers.delete);

    app.use("/giwazip/workers", router);
};
