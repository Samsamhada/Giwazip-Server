const db = require("../models");
const Room = db.rooms;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.workerID || !req.body.clientName || !req.body.warrantyTime) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        console.log(
            "Error: Room 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다."
        );
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
            console.log(
                "Room 테이블에 새로운 데이터가 성공적으로 추가되었습니다."
            );
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Room.",
            });
            console.log(
                err.message || "Some error occurred while creating the Room."
            );
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Room.findAll({ where: condition })
        .then((data) => {
            res.send(data);
            console.log("Room 테이블의 모든 데이터를 성공적으로 조회했습니다.");
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving rooms.",
            });
            console.log(
                err.message || "Some error occurred while retrieving rooms."
            );
        });
};

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

exports.update = (req, res) => {
    const id = req.params.id;

    Room.update(req.body, {
        where: { roomID: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Room was updated successfully.",
                });
                console.log("Room 테이블이 성공적으로 수정되었습니다.");
            } else {
                res.send({
                    message: `Cannot update Room with id=${id}. Maybe Room was not found or req.body is empty!`,
                });
                console.log(
                    `Room 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, 수정을 원하는 데이터 정보가 없습니다!`
                );
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Room with id=" + id,
            });
            console.log(
                `Error: Room 테이블의 ${id}번을 수정하는 데 오류가 발생했습니다.`
            );
        });
};

