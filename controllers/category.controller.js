const db = require("../models");
const Category = db.categories;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const chalk = require("chalk");
const moment = require("moment");

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    if (req.header("API-Key")) {
        // Validate request

        let roomID = req.body.roomID;
        let name = req.body.name;

        if (!roomID || !name) {
            res.status(400).send({
                message: "Category 테이블의 필수 정보가 누락 되었습니다!",
            });
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                    `🔴 ${chalk.red("Error:")}` +
                    " Category 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: " +
                    (req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress) +
                    ")"
            );
            return;
        }

        // Create a Status
        const category = {
            roomID: roomID,
            name: name,
            progress: 0,
        };

        Category.create(category)
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Category 테이블에 새로운 데이터가 성공적으로 추가되었습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "새로운 Category를 추가하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "새로운 Category를 추가하는 중에 문제가 발생했습니다. (IP: " +
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
                " Connection Fail at POST /categories (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findAll = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        Category.findAll({ order: [["categoryID", "ASC"]] })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Category 테이블의 모든 데이터를 성공적으로 조회했습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Category 테이블을 조회하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Category 테이블을 조회하는 중에 문제가 발생했습니다. (IP: " +
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
                " Connection Fail at GET /categories (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Category.findByPk(id)
            .then((data) => {
                if (data) {
                    res.send(data);
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgGreen("Success:") +
                            ` Category 테이블의 id=${id}번 데이터를 성공적으로 조회했습니다. (IP: ` +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                } else {
                    res.status(400).send({
                        message: `Category 테이블에서 id=${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgRed("Error:") +
                            ` Category 테이블에서 id=${id}번 데이터를 찾을 수 없습니다.` +
                            " (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Category 테이블의 id=${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        ` Category 테이블의 id=${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error: ") +
                ` Connection Fail at GET /categories/${id}` +
                " (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};
