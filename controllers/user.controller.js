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
const reqHeaderAPIKeyField = "x-api-key";
const asc = "ASC";

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        const number = req.body.number;

        const user = {
            number: number,
        };

        User.findOrCreate({
            where: { number: number },
            defaults: user,
        })
            .then((data) => {
                res.status(200).send(data[0]);
                if (data[1]) {
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${User.name} 테이블`
                        )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                    );
                } else {
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${data[0].userID}번 유저`
                        )}가 로그인에 성공했습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `새로운 ${User.name}를 추가하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} 새로운 ${chalk.yellow(
                        User.name
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

exports.createWithWorker = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        const userID = req.body.userID;
        const userIdentifier = req.body.worker.userIdentifier;
        const name = req.body.worker.name;
        const email = req.body.worker.email;

        if (userID) {
            res.status(400).send({
                message: `${User.name} + ${Worker.name} 테이블에 userID는 직접 지정할 수 없습니다!`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${User.name} + ${Worker.name} 테이블`
                )}에 userID를 직접 지정하여 create를 시도하였습니다. (IP: ${IP})`
            );
            return;
        }

        if (!userIdentifier || !name || !email) {
            res.status(400).send({
                message: `${User.name} + ${Worker.name} 테이블의 필수 정보가 누락 되었습니다!`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${User.name} + ${Worker.name} 테이블`
                )}의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: ${IP})`
            );
            return;
        }

        const userWorker = {
            number: req.body.number,
            worker: {
                userIdentifier: userIdentifier,
                name: name,
                email: email,
            },
        };

        User.create(userWorker, { include: [{ model: Worker, as: "worker" }] })
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${User.name} + ${Worker.name} 테이블`
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${User.name} + ${Worker.name} 테이블에 새로운 데이터를 추가하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${User.name} + ${Worker.name} 테이블`
                    )}에 새로운 데이터를 추가하는 중에 문제가 발생했습니다. ${chalk.dim(
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
                "POST /users/worker"
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithUserIdentifier = (req, res) => {
    const userIdentifier = req.body.worker.userIdentifier;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        User.findOne({
            include: [
                {
                    model: Worker,
                    as: "worker",
                    where: { userIdentifier: userIdentifier },
                },
            ],
        })
            .then((data) => {
                if (data) {
                    res.status(200).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${User.name} + ${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `userIdentifier=${userIdentifier}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else if (!userIdentifier) {
                    res.status(400).send({
                        message: `${User.name} + ${Worker.name} 테이블의 userIdentifier의 조회를 시도했지만, request의 body가 비어있어 조회할 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${User.name} + ${Worker.name} 테이블`
                        )}의 userIdentifier의 조회를 시도했지만, request의 body가 비어있어 조회할 수 없습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${User.name} + ${Worker.name} 테이블에서 userIdentifier=${userIdentifier}인 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${User.name} + ${Worker.name} 테이블`
                        )}에서 ${chalk.yellow(
                            `userIdentifier=${userIdentifier}`
                        )}인 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${User.name} + ${Worker.name} 테이블의 userIdentifier=${userIdentifier}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${User.name} + ${Worker.name} 테이블`
                    )}의 ${chalk.yellow(
                        `userIdentifier=${userIdentifier}`
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
                `POST /users/auth`
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
                        `${User.name} + ${Worker.name} 테이블`
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${User.name} + ${Worker.name} 테이블을 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${User.name} + ${Worker.name} 테이블`
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
                if (data) {
                    res.status(200).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${User.name} + ${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${User.name} + ${Worker.name} 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${User.name} + ${Worker.name} 테이블`
                        )}에서 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${User.name} + ${Worker.name} 테이블의 ${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${User.name} + ${Worker.name} 테이블`
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
            order: [["userrooms", "roomID", asc]],
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
                if (data) {
                    res.status(200).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${User.name} + ${Worker.name} + ${UserRoom.name} + ${Room.name} 테이블`
                        )}의 ${chalk.yellow(
                            `userID=${id}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${User.name} + ${Worker.name} + ${UserRoom.name} + ${Room.name} 테이블에서 userID=${id}인 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${User.name} + ${Worker.name} + ${UserRoom.name} + ${Room.name} 테이블`
                        )}의 ${chalk.yellow(
                            `userID=${id}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${User.name} + ${Worker.name} + ${UserRoom.name} + ${Room.name} 테이블의 userID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${User.name} + ${Worker.name} + ${UserRoom.name} + ${Room.name} 테이블`
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
    const number = req.body.number;

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
                            `${User.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else if (!number) {
                    res.status(400).send({
                        message: `${User.name} 테이블의 ${id}번 데이터의 수정을 시도했지만, request의 body가 비어있어 수정할 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${User.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했지만, request의 body가 비어있어 수정할 수 없습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${User.name} 테이블의 ${id}번 데이터의 수정을 시도했지만, 해당 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${User.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했지만, 해당 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${User.name} 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${User.name} 테이블`
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
                `PUT /users/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        User.destroy({
            where: { userID: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.status(200).send({
                        message: `${User.name} 테이블의 ${id}번 데이터가 성공적으로 삭제되었습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${User.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 삭제되었습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${User.name} 테이블에서 ${id}번 데이터의 삭제를 시도했으나, 해당 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${User.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 삭제를 시도했으나, 해당 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${User.name} 테이블의 ${id}번 데이터를 삭제하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${User.name} 테이블`
                    )}의 ${chalk.yellow(
                        `${id}번`
                    )} 데이터를 삭제하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "상세정보: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(403).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                `DELETE /users/${id}`
            )} (IP: ${IP})`
        );
    }
};
