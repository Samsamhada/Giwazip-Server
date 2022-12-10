const db = require("../models");
const Room = db.rooms;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const chalk = require("chalk");
const moment = require("moment");

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        // Validate request
        if (
            !req.body.workerID ||
            !req.body.clientName ||
            !req.body.warrantyTime
        ) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                    chalk.bgRed("Error:") +
                    " Room 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: " +
                    (req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress) +
                    ")"
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

            return new Date(
                year,
                month - 1,
                day,
                hour,
                minute,
                second,
                millisec
            );
        }

        function generateRandomString(stringLength = 6) {
            const characters =
                "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            let randomString = "";

            for (let i = 0; i < stringLength; i++) {
                const randomNumber = Math.floor(
                    Math.random() * characters.length
                );
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
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Room 테이블에 새로운 데이터가 성공적으로 추가되었습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating the Room.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Some error occurred while creating the Room. (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                " Connection Fail at POST /rooms (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findAll = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        Room.findAll()
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Room 테이블의 모든 데이터를 성공적으로 조회했습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving rooms.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Some error occurred while retrieving rooms. (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                " Connection Fail at GET /rooms (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Room.findByPk(id)
            .then((data) => {
                if (data) {
                    res.send(data);
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgGreen("Success:") +
                            ` Room 테이블의 ${id}번 데이터를 성공적으로 조회했습니다.` +
                            " (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                } else {
                    res.status(400).send({
                        message: `Cannot find Room with id=${id}.`,
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgRed("Error:") +
                            ` Room 테이블에서 ${id}번 데이터를 찾을 수 없습니다.` +
                            " (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Error retrieving Room with id=" + id,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " Error retrieving Room with id=" +
                        id +
                        " (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                ` Connection Fail at GET /rooms/${id}` +
                " (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findByWorkerID = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Room.findAll({ where: { workerID: id } })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        ` Room 테이블의 workerID가 ${id}인 모든 데이터를 성공적으로 조회했습니다.` +
                        " (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving rooms.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Some error occurred while retrieving rooms. (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                `Connection Fail at GET /rooms/worker/${id}` +
                " (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findByInviteCode = (req, res) => {
    const inviteCode = req.params.inviteCode;

    if (req.header("API-Key") == apiKey) {
        Room.findAll({ where: { inviteCode: inviteCode } })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        ` Room 테이블의 inviteCode가 ${inviteCode}인 모든 데이터를 성공적으로 조회했습니다.` +
                        " (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving rooms.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Some error occurred while retrieving rooms. (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                `Connection Fail at GET /rooms/invite_code/${inviteCode}` +
                " (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Room.update(req.body, {
            where: { roomID: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Room was updated successfully.",
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgGreen("Success:") +
                            " Room 테이블이 성공적으로 수정되었습니다. (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                } else {
                    res.send({
                        message: `Cannot update Room with id=${id}. Maybe Room was not found or req.body is empty!`,
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgRed("Error:") +
                            ` Room 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, 수정을 원하는 데이터 정보가 없습니다!` +
                            " (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Error updating Room with id=" + id,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        `Room 테이블의 ${id}번을 수정하는 데 오류가 발생했습니다.` +
                        " (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                ` Connection Fail at PUT /rooms/${id}` +
                " (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Room.destroy({
            where: { roomID: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Room was deleted successfully!",
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgGreen("Success:") +
                            " Room 테이블에서 해당 데이터가 성공적으로 삭제되었습니다! (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                } else {
                    res.send({
                        message: `Cannot delete Room with id=${id}. Maybe Room was not found!`,
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgRed("Error:") +
                            ` Room 테이블에서 ${id}번 데이터를 삭제할 수 없습니다. Room 테이블에서 해당 데이터를 찾을 수 없습니다.` +
                            " (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Could not delete Room with id=" + id,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        ` Room 테이블의 ${id}번 데이터를 삭제할 수 없습니다.` +
                        " (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                ` Connection Fail at DELETE /rooms/${id}` +
                " (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};
