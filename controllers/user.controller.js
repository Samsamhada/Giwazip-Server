const db = require("../models");
const User = db.users;
const Worker = db.workers;
const Room = db.rooms;
const UserRoom = db.userrooms;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const moment = require("moment");
const chalk = require("chalk");

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        // Create a User
        const user = {
            isWorker: req.body.isWorker,
            number: req.body.number,
        };

        User.create(user)
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " User 테이블에 새로운 데이터가 성공적으로 추가되었습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "새로운 User를 추가하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "새로운 유저를 추가하는 중에 문제가 발생했습니다. (IP: " +
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
                " Connection Fail at POST /users (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findAllWithWorker = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        User.findAll({
            order: [["userID", "ASC"]],
            include: [
                {
                    model: Worker,
                    as: "worker",
                    attributes: ["userIdentifier", "name", "email"],
                },
            ],
        })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(
                        "YYYY-MM-DD HH:mm:ss.SSS"
                    )}] ${chalk.green("Success: ")} ${chalk.bold(
                        "User + Worker 테이블"
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${
                        req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress
                    })`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "User + Worker 테이블을 조회하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.red("Error: ") +
                        " User + Worker 테이블을 조회하는 중에 문제가 발생했습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.red("Error: ") +
                " Connection Fail at GET /users/worker (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findOneWithWorker = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        User.findAll({
            where: { userID: id },
            include: [
                {
                    model: Worker,
                    as: "worker",
                    attributes: ["userIdentifier", "name", "email"],
                },
            ],
        })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(
                        "YYYY-MM-DD HH:mm:ss.SSS"
                    )}] ${chalk.green("Success: ")} ${chalk.bold(
                        "User + Worker 테이블"
                    )}의 userID가 ${id}인 업자 정보를 포함한 모든 데이터를 성공적으로 조회했습니다. (IP: ${
                        req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress
                    })`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "User + Worker 테이블을 조회하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.red("Error: ") +
                        " User + Worker 테이블을 조회하는 중에 문제가 발생했습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.red("Error: ") +
                ` Connection Fail at GET /users/worker/${id} (IP: ` +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findAllRoom = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        User.findAll({
            order: [["userID", "ASC"]],
            include: [
                {
                    model: UserRoom,
                    as: "userrooms",
                    attributes: ["roomID"],
                    order: [["roomID", "ASC"]],
                    include: [
                        {
                            model: Room,
                            as: "room",
                            attributes: [
                                "name",
                                "startDate",
                                "endDate",
                                "warrantyTime",
                                "inviteCode",
                            ],
                        },
                    ],
                },
            ],
        })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(
                        "YYYY-MM-DD HH:mm:ss.SSS"
                    )}] ${chalk.green("Success: ")} ${chalk.bold(
                        "User + Room 테이블"
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${
                        req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress
                    })`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "User + Room 테이블을 조회하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.red("Error: ") +
                        " User + Room 테이블을 조회하는 중에 문제가 발생했습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.red("Error: ") +
                " Connection Fail at GET /users/room (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};
