const db = require("../models");
const User = db.users;
const Worker = db.workers;
const Room = db.rooms;
const UserRoom = db.userrooms;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const moment = require("moment");
const chalk = require("chalk");
const purple = chalk.hex("#9900ff");
const dateFormat = "YYYY-MM-DD HH:mm:ss.SSS";
const success = `🟢${chalk.green("Success:")}`;
const badAccessError = `🔴${chalk.red("Error:")}`;
const unknownError = `🟣${purple("Error:")}`;
const reqHeaderIPField = "X-FORWARDED-FOR";
const reqHeaderAPIKeyField = "API-Key";
const asc = "ASC";
const userLabel = "User";
const workerLabel = "Worker";
const roomLabel = "Room";
const userroomLabel = "User-Room";

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    const IP = req.header("X-FORWARDED-FOR") || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        const user = {
            number: req.body.number,
        };

        User.create(user)
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${userLabel} 테이블`
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `새로운 ${userLabel}를 추가하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} 새로운 ${chalk.yellow(
                        userLabel
                    )}를 추가하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(403).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "POST /users"
            )} (IP: ${IP})`
        );
    }
};

exports.findAll = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        User.findAll({
            order: [["userID", asc]],
            include: [
                {
                    model: Worker,
                    as: "worker",
                    attributes: ["userIdentifier", "name", "email"],
                },
            ],
        })
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${userLabel} + ${workerLabel} 테이블`
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${userLabel} + ${workerLabel} 테이블을 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${userLabel} + ${workerLabel} 테이블`
                    )}을 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(403).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "GET /users"
            )} (IP: ${IP})`
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        User.findOne({
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
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${userLabel} + ${workerLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `${id}번`
                    )} 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${userLabel} + ${workerLabel} 테이블의 ${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${userLabel} + ${workerLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `${id}번`
                    )} 데이터를 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(403).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                `GET /users/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithRoom = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        User.findOne({
            where: { userID: id },
            order: [["userID", asc]],
            include: [
                {
                    model: Worker,
                    as: "worker",
                    attributes: ["userIdentifier", "name", "email"],
                },
                {
                    model: UserRoom,
                    as: "userrooms",
                    attributes: ["roomID"],
                    order: [["roomID", asc]],
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
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${userLabel} + ${workerLabel} + ${userroomLabel} + ${roomLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `userID=${id}`
                    )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${userLabel} + ${workerLabel} + ${userroomLabel} + ${roomLabel} 테이블의 userID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${userLabel} + ${workerLabel} + ${userroomLabel} + ${roomLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `userID=${id}`
                    )}인 데이터를 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(403).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                `GET /users/room/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        User.update(req.body, {
            where: { userID: id },
            returning: true,
        })
            .then((data) => {
                if (data[0] == 1) {
                    res.status(200).send(data[1][0]);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${userLabel} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else {
                    res.send({
                        message: `${userLabel} 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${userLabel} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${userLabel} 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${userLabel} 테이블`
                    )}의 ${chalk.yellow(
                        `${id}번`
                    )} 데이터를 수정하는 중에 문제가 발생했습니다. ${chalk.dim(
                        `상세정보: ${err.message}`
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(403).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "PUT /users/${id}"
            )} (IP: ${IP})`
        );
    }
};
