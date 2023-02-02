const db = require("../models");
const Room = db.rooms;
const Category = db.categories;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const chalk = require("chalk");
const moment = require("moment");
const purple = chalk.hex("#9900ff");
const dateFormat = "YYYY-MM-DD HH:mm:ss.SSS";
const success = `🟢${chalk.green("Success:")}`;
const badAccessError = `🔴${chalk.red("Error:")}`;
const unknownError = `🟣${purple("Error:")}`;

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    const IP = req.header("X-FORWARDED-FOR") || req.socket.remoteAddress;

    if (req.header("API-Key") == apiKey) {
        if (!req.body.name) {
            res.status(400).send({
                message: "시공하려는 고객의 별칭이 포함되지 않았습니다!",
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    "Room 테이블"
                )}의 필수 데이터 name을 포함하지 않고 Create를 시도했습니다. (IP: ${IP})`
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
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;

        if (startDate) {
            startDate = stringToDate(startDate);
        }
        if (endDate) {
            endDate = stringToDate(endDate);
        }

        const room = {
            name: req.body.name,
            startDate: startDate,
            endDate: endDate,
            warrantyTime: req.body.warrantyTime,
            inviteCode: inviteCode,
        };

        Room.create(room)
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        "Room 테이블"
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: "새로운 Room을 추가하는 중에 문제가 발생했습니다.",
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${badAccessError} 새로운 ${chalk.yellow(
                        "Room"
                    )}을 추가하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "상세정보: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "POST /rooms"
            )} (IP: ${IP})`
        );
    }
};

exports.findAll = (req, res) => {
    const IP = req.header("X-FORWARDED-FOR") || req.socket.remoteAddress;

    if (req.header("API-Key") == apiKey) {
        Room.findAll({ order: [["roomID", "ASC"]] })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        "Room 테이블"
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Room 테이블을 조회하는 중에 문제가 발생했습니다.",
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        "Room 테이블"
                    )}을 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "상세정보: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "GET /rooms"
            )} (IP: ${IP})`
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    const IP = req.header("X-FORWARDE-FOR") || req.socket.remoteAddress;

    if (req.header("API-Key") == apiKey) {
        Room.findByPk(id)
            .then((data) => {
                if (data) {
                    res.send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            "Room 테이블"
                        )}의 ${chalk.yellow(
                            id + "번"
                        )} 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(400).send({
                        message: `Room 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            "Room 테이블"
                        )}에서 ${chalk.yellow(
                            id + "번"
                        )} 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Room 테이블의 ${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        "Room 테이블"
                    )}의 ${chalk.yellow(
                        id + "번"
                    )} 데이터를 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "상세정보: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "GET /rooms/" + id
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithCategory = (req, res) => {
    const id = req.params.id;
    const IP = req.header("X-FORWARDED-FOR") || req.socket.remoteAddress;

    if (req.header("API-Key") == apiKey) {
        Room.findAll({
            where: { roomID: id },
            order: [["roomID", "ASC"]],
            include: [
                {
                    model: Category,
                    as: "categories",
                    attributes: ["categoryID", "name", "progress"],
                },
            ],
        })
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        "Room + Category 테이블"
                    )}의 ${chalk.yellow(
                        "roomID=" + id
                    )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Room + Category 테이블의 roomID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        "Room + Category 테이블"
                    )}의 ${chalk.yellow(
                        "romID=" + id
                    )}인 데이터를 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "상세정보: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "GET /rooms/category/" + id
            )} (IP: ${IP})`
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    const IP = req.header("X-FORWARDED-FOR") || req.socket.remoteAddress;

    if (req.header("API-Key") == apiKey) {
        Room.update(req.body, {
            where: { roomID: id },
            returning: true,
        })
            .then((data) => {
                if (data[0] == 1) {
                    res.send(data[1][0]);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            "Room 테이블"
                        )}의 ${chalk.yellow(
                            id + "번"
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else {
                    res.send({
                        message: `Room 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            "Room 테이블"
                        )}의 ${chalk.yellow(
                            id + "번"
                        )} 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Room 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        "Room 테이블"
                    )}의 ${chalk.yellow(
                        id + "번"
                    )} 데이터를 수정하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "상세정보: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "PUT /rooms/" + id
            )} (IP: ${IP})`
        );
    }
};
