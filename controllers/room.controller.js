const db = require("../models");
const Room = db.rooms;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.workerID || !req.body.clientName || !req.body.warrantyTime) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }

    function generateRandomString(stringLength = 6) {
        const characters =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let randomString = "";

        for (let i = 0; i < stringLength; i++) {
            const randomNumber = Math.floor(Math.random() * characters.length);
            randomString += characters.substring(
                randomNumber,
                randomNumber + 1
            );
        }

        return randomString;
    }

    const inviteCode = generateRandomString();

    // Create a Room
    const room = {
        workerID: req.body.workerID,
        clientName: req.body.clientName,
        clientNumber: req.body.clientNumber,
        startDate: req.body.startDate,
        endDate: req.body.endData,
        warrantyTime: req.body.warrantyTime,
        inviteCode: inviteCode,
    };

    Room.create(room)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Worker.",
            });
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Room.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving workers.",
exports.findOne = (req, res) => {
    const id = req.params.id;

    Room.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
                console.log(
                    `Room 테이블의 ${id}번 데이터를 성공적으로 조회했습니다.`
                );
            } else {
                res.status(400).send({
                    message: `Cannot find Room with id=${id}.`,
                });
                console.log(
                    `Room 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`
                );
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving Room with id=" + id,
            });
            console.log("Error retrieving Worker with id=" + id);
        });
};
