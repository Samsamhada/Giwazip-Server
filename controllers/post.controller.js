const db = require("../models");
const Post = db.posts;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const chalk = require("chalk");
const moment = require("moment");
const { sequelize, Sequelize } = require("../models");

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        // Validate request
        if (
            !req.body.roomID ||
            req.body.category < 0 ||
            req.body.type < 0 ||
            req.body.type > 1
        ) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                    chalk.bgRed("Error:") +
                    "Post 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다."
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

        // Create a Status
        const post = {
            roomID: req.body.roomID,
            category: req.body.category,
            type: req.body.type,
            description: req.body.description,
        };

        Post.create(post)
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Post 테이블에 새로운 데이터가 성공적으로 추가되었습니다."
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating the Post.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Some error occurred while creating the Post."
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                "Connection Fail at POST /posts"
        );
    }
};

exports.findAll = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        Post.findAll()
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Post 테이블의 모든 데이터를 성공적으로 조회했습니다."
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving posts.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Some error occurred while retrieving posts."
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                " Connection Fail at GET /posts"
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Post.findByPk(id)
            .then((data) => {
                if (data) {
                    res.send(data);
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgGreen("Success:") +
                            ` Post 테이블의 ${id}번 데이터를 성공적으로 조회했습니다.`
                    );
                } else {
                    res.status(400).send({
                        message: `Cannot find Post with id=${id}.`,
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgRed("Error:") +
                            ` Post 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Error retrieving Post with id=" + id,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " Error retrieving Post with id=" +
                        id
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                ` Connection Fail at GET /posts/${id}`
        );
    }
};

exports.findByRoomID = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Post.findAll({ where: { roomID: id } })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        ` Post 테이블의 roomID가 ${id}인 모든 데이터를 성공적으로 조회했습니다.`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving posts.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Some error occurred while retrieving posts."
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                `Connection Fail at GET /posts/room/${id}`
        );
    }
};

exports.findByCategory = (req, res) => {
    const category = req.params.category;

    if (req.header("API-Key") == apiKey) {
        Post.findAll({ where: { category: category } })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        ` Post 테이블의 category가 ${category}인 모든 데이터를 성공적으로 조회했습니다.`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while retrieving posts.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "Some error occurred while retrieving posts."
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                ` Connect Fail at GET /posts/category/${category}`
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Post.update(req.body, {
            where: { postID: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Post was updated successfully.",
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgGreen("Success:") +
                            " Post 테이블이 성공적으로 수정되었습니다."
                    );
                } else {
                    res.send({
                        message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`,
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgRed("Error:") +
                            ` Post 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, 수정을 원하는 데이터 정보가 없습니다!`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Error updating Post with id=" + id,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        ` Post 테이블의 ${id}번을 수정하는 데 오류가 발생했습니다.`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                ` Connection Fail at PUT /posts/${id}`
        );
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;

    if (req.header("API-Key") == apiKey) {
        Post.destroy({
            where: { postID: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Post was deleted successfully!",
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgGreen("Success:") +
                            " Post 테이블에서 해당 데이터가 성공적으로 삭제되었습니다!"
                    );
                } else {
                    res.send({
                        message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
                    });
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgRed("Error:") +
                            ` Post 테이블에서 ${id}번 데이터를 삭제할 수 없습니다. Post 테이블에서 해당 데이터를 찾을 수 없습니다.`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Could not delete Post with id=" + id,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        ` Post 테이블의 ${id}번 데이터를 삭제할 수 없습니다.`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                ` Connection Fail at DELETE /posts/${id}`
        );
    }
};
