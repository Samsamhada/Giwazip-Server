const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const moment = require("moment");
const chalk = require("chalk");
const purple = chalk.hex("#9900ff");
const dateFormat = "YYYY-MM-DD HH:mm:ss.SSS";

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    const IP = req.header("X-FORWARDED-FOR") || req.socket.remoteAddress;

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
                    `[${moment().format(dateFormat)}] 🟢${chalk.green(
                        "Success:"
                    )} ${chalk.yellow(
                        "User 테이블"
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: "새로운 User를 추가하는 중에 문제가 발생했습니다.",
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(dateFormat)}] 🟣${purple(
                        "Error:"
                    )} 새로운 ${chalk.yellow(
                        "User"
                    )}를 추가하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "detail: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(dateFormat)}] 🔴${chalk.red(
                "Error:"
            )} Connection Fail at POST /users (IP: ${IP})`
        );
    }
};

exports.findAll = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        User.findAll({ order: [["userID", "ASC"]] })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ` +
                        chalk.bgGreen("Success:") +
                        " User 테이블의 모든 데이터를 성공적으로 조회했습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "User 테이블을 조회하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format(dateFormat)}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "User 테이블을 조회하는 중에 문제가 발생했습니다. (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(dateFormat)}] ` +
                chalk.bgRed("Error:") +
                " Connection Fail at GET /users (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        User.findByPk(id)
            .then((data) => {
                if (data) {
                    res.send(data);
                    console.log(
                        `[${moment().format(dateFormat)}] ` +
                            chalk.bgGreen("Success:") +
                            ` User 테이블의 id=${id}번 데이터를 성공적으로 조회했습니다. (IP: ` +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                } else {
                    res.status(400).send({
                        message: `User 테이블에서 id=${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(dateFormat)}] ` +
                            chalk.bgRed("Error:") +
                            ` User 테이블에서 id=${id}번 데이터를 찾을 수 없습니다.` +
                            " (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `User 테이블의 id=${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                });
                console.log(
                    `[${moment().format(dateFormat)}] ` +
                        chalk.bgRed("Error:") +
                        ` User 테이블의 id=${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(dateFormat)}] ` +
                chalk.bgRed("Error: ") +
                ` Connection Fail at GET /users/${id}` +
                " (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    const IP = req.header("X-FORWARDED-FOR") || req.socket.remoteAddress;

    if (req.header("API-Key") == apiKey) {
        User.update(req.body, {
            where: { userID: id },
            returning: true,
        })
            .then((data) => {
                if (data[0] == 1) {
                    res.send(data[1][0]);
                    console.log(
                        `[${moment().format(dateFormat)}] 🟢${chalk.green(
                            "Success:"
                        )} ${chalk.yellow("User 테이블")}의 ${chalk.yellow(
                            id + "번"
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else {
                    res.send({
                        message: `User 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다.`,
                    });
                    console.log(
                        `[${moment().format(dateFormat)}] 🔴${chalk.red(
                            "Error:"
                        )} ${chalk.yellow("User 테이블")}의 ${chalk.yellow(
                            id + "번"
                        )} 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `User 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(dateFormat)}] 🟣${purple(
                        "Error:"
                    )} ${chalk.yellow("User 테이블")}의 ${chalk.yellow(
                        id + "번"
                    )} 데이터를 수정하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "상세정보: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(dateFormat)}] 🔴${chalk.red(
                "Error:"
            )} Connection Fail at PUT /users/${id} (IP: ${IP})`
        );
    }
};
