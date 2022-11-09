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

    function stringToDate(str) {
        let year = str.substr(0, 4);
        let month = str.substr(5, 2);
        let day = str.substr(8, 2);

        let hour = str.substr(11, 2);
        let minute = str.substr(14, 2);
        let second = str.substr(17, 2);
        let millisec = str.substr(20, 3);

        return new Date(year, month - 1, day, hour, minute, second, millisec);
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
        startDate: stringToDate(req.body.startDate.toString()),
        endDate: stringToDate(req.body.endDate.toString()),
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
    Room.findAll()
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
            console.log("Error retrieving Room with id=" + id);
        });
};

exports.findByWorkerID = (req, res) => {
    const id = req.params.id;

    Room.findAll({ where: { workerID: id } })
        .then((data) => {
            res.send(data);
            console.log(
                `Room 테이블의 workerID가 ${id}인 모든 데이터를 성공적으로 조회했습니다.`
            );
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

exports.delete = (req, res) => {
    const id = req.params.id;

    Room.destroy({
        where: { roomID: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Room was deleted successfully!",
                });
                console.log(
                    "Room 테이블에서 해당 데이터가 성공적으로 삭제되었습니다!"
                );
            } else {
                res.send({
                    message: `Cannot delete Room with id=${id}. Maybe Room was not found!`,
                });
                console.log(
                    `Room 테이블에서 ${id}번 데이터를 삭제할 수 없습니다. Room 테이블에서 해당 데이터를 찾을 수 없습니다.`
                );
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Room with id=" + id,
            });
            console.log(`Room 테이블의 ${id}번 데이터를 삭제할 수 없습니다.`);
        });
};
