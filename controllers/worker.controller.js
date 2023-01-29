const db = require("../models");
const Worker = db.workers;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const moment = require("moment");
const chalk = require("chalk");

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        // Validate request

        let userID = req.body.userID;
        let userIdentifier = req.body.userIdentifier;
        let name = req.body.name;
        let email = req.body.email;

        if (!userID || !userIdentifier || !name || !email) {
            res.status(400).send({
                message: "Worker 테이블의 필수 정보가 누락 되었습니다!",
            });
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                    chalk.bgRed("Error:") +
                    " Worker 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: " +
                    (req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress) +
                    ")"
            );
            return;
        }

        // Create a Worker
        const worker = {
            userID: userID,
            userIdentifier: userIdentifier,
            name: name,
            email: email,
        };

        Worker.create(worker)
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Worker 테이블에 새로운 데이터가 성공적으로 추가되었습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "새로운 업자 정보를 추가하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "새로운 Worker 정보를 추가하는 중에 문제가 발생했습니다. (IP: " +
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
                " Connection Fail at POST /workers (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findAll = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        Worker.findAll({ order: [["userID", "ASC"]] })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Worker 테이블의 모든 데이터를 성공적으로 조회했습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Worker 테이블을 조회하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Worker 테이블을 조회하는 중에 문제가 발생했습니다. (IP: " +
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
                " Connection Fail at GET /workers (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Worker.findByPk(id)
            .then((data) => {
                if (data) {
                    res.send(data);
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgGreen("Success:") +
                            ` Worker 테이블의 id=${id}번 데이터를 성공적으로 조회했습니다. (IP: ` +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                } else {
                    res.status(400).send({
                        message: `User 테이블에서 id=${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgRed("Error:") +
                            ` Worker 테이블에서 id=${id}번 데이터를 찾을 수 없습니다.` +
                            " (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Worker 테이블의 id=${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        ` Worker 테이블의 id=${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error: ") +
                ` Connection Fail at GET /workers/${id}` +
                " (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};
