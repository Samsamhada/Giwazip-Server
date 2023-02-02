const db = require("../models");
const Post = db.posts;
const Photo = db.photos;
const User = db.users;
const Worker = db.workers;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const chalk = require("chalk");
const moment = require("moment");
const purple = chalk.hex("#9900ff");
const success = `🟢${chalk.green("Success:")}`;
const badAccessError = `🔴${chalk.red("Error:")}`;
const unknownError = `🟣${purple("Error:")}`;
const dateFormat = "YYYY-MM-DD HH:mm:ss.SSS";
const reqHeaderIPField = "X-FORWARDED-FOR";
const reqHeaderAPIKeyField = "API-Key";
const asc = "ASC";
const userLabel = "User";
const workerLabel = "Worker";
const roomLabel = "Room";
const userroomLabel = "User-Room";
const categoryLabel = "Category";
const postLabel = "Post";
const photoLabel = "Photo";

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        let roomID = req.body.roomID;
        let userID = req.body.userID;
        let categoryID = req.body.categoryID;

        if (!roomID || !userID || !categoryID) {
            res.status(400).send({
                message: `${postLabel} 테이블의 필수 정보가 누락 되었습니다.`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${postLabel} 테이블`
                )}의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: ${IP})`
            );
            return;
        }

        const post = {
            roomID: roomID,
            userID: userID,
            categoryID: categoryID,
            description: req.body.description,
        };

        Post.create(post)
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${postLabel} 테이블`
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `새로운 ${postLabel}를 추가하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} 새로운 ${chalk.yellow(
                        postLabel
                    )}를 추가하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "POST /posts"
            )} (IP: ${IP})`
        );
    }
};

exports.findAll = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Post.findAll({
            order: [["postID", asc]],
            include: [
                {
                    model: Photo,
                    as: "photos",
                    attributes: ["photoID", "url"],
                },
            ],
        })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${postLabel} + ${photoLabel} 테이블`
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${postLabel} + ${photoLabel} 테이블을 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${postLabel} + ${photoLabel} 테이블`
                    )}을 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "GET /posts"
            )} (IP: ${IP})`
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Post.findAll({
            where: { postID: id },
            include: [
                {
                    model: Photo,
                    as: "photos",
                    attributes: ["photoID", "url"],
                },
            ],
        })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${postLabel} + ${photoLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `${id}번`
                    )} 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${postLabel} + ${photoLabel} 테이블의 ${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${postLabel} + ${photoLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `${id}번`
                    )} 데이터를 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                `GET /posts/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithUser = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Post.findAll({
            where: { postID: id },
            attributes: [
                "postID",
                "roomID",
                "categoryID",
                "description",
                "createDate",
            ],
            order: [["postID", asc]],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["userID", "number"],
                    order: [["userID", asc]],
                    include: [
                        {
                            model: Worker,
                            as: "worker",
                            attributes: ["userIdentifier", "name", "email"],
                        },
                    ],
                },
                {
                    model: Photo,
                    as: "photos",
                    attributes: ["photoID", "url"],
                },
            ],
        })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${postLabel} + ${userLabel} + ${workerLabel} + ${photoLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `postID=${id}`
                    )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${postLabel} + ${userLabel} + ${workerLabel} + ${photoLabel} 테이블의 postID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${postLabel} + ${userLabel} + ${workerLabel} + ${photoLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `postID=${id}`
                    )}인 데이터를 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                `GET /posts/user/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Post.update(req.body, {
            where: { postID: id },
            returning: true,
        })
            .then((data) => {
                if (data[0] == 1) {
                    res.send(data[1][0]);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${postLabel} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else {
                    res.send({
                        message: `${postLabel} 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${postLabel} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${postLabel} 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${postLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `${id}번`
                    )} 데이터를 수정하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                `PUT /posts/${id}`
            )} (IP: ${IP})`
        );
    }
};
