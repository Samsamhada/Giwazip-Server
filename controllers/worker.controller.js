const db = require("../models");
const Worker = db.workers;
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
        let userID = req.body.userID;
        let userIdentifier = req.body.userIdentifier;
        let name = req.body.name;
        let email = req.body.email;

        if (!userID || !userIdentifier || !name || !email) {
            res.status(400).send({
                message: `${Worker.name} 테이블의 필수 정보가 누락 되었습니다!`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${Worker.name} 테이블`
                )}의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: ${IP})`
            );
            return;
        }

        const worker = {
            userID: userID,
            userIdentifier: userIdentifier,
            name: name,
            email: email,
        };

        Worker.create(worker)
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${Worker.name} 테이블`
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `새로운 ${Worker.name}를 추가하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} 새로운 ${chalk.yellow(
                        Worker.name
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
                "POST /workers"
            )} (IP: ${IP})`
        );
    }
};

exports.findAll = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Worker.findAll({ order: [["userID", asc]] })
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${Worker.name} 테이블`
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Worker.name} 테이블을 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Worker.name} 테이블`
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
                "GET /workers"
            )} (IP: ${IP})`
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Worker.findByPk(id)
            .then((data) => {
                if (data) {
                    res.status(200).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Worker.name} 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Worker.name} 테이블`
                        )}에서 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Worker.name} 테이블의 ${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Worker.name} 테이블`
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
                `GET /workers/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;
    const userID = req.body.userID;
    const userIdentifier = req.body.userIdentifier;
    const name = req.body.name;
    const email = req.body.email;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        if (userID) {
            res.status(400).send({
                message: `${Worker.name} 테이블의 ${id}번 데이터의 userID를 ${userID}로 변경할 수 없습니다.`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${Worker.name} 테이블`
                )}의 ${chalk.yellow(
                    `${id}번`
                )} 데이터의 userID를 ${chalk.yellow(
                    userID
                )}로 변경할 수 없습니다. (IP: ${IP})`
            );
            return;
        }

        Worker.update(req.body, {
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
                            `${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else if (!userIdentifier && !name && !email) {
                    res.status(400).send({
                        message: `${Worker.name} 테이블의 ${id}번 데이터의 수정을 시도했지만, request의 body가 비어있어 수정할 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했지만, request의 body가 비어있어 수정할 수 없습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Worker.name} 테이블의 ${id}번 데이터의 수정을 시도했지만, 해당 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했지만, 해당 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Worker.name} 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Worker.name} 테이블`
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
                "YYYY-MM-DD HH:mm:ss.SSS"
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                "POST /workers"
            )} (IP: ${IP})`
        );
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Worker.destroy({
            where: { userID: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.status(200).send({
                        message: `${Worker.name} 테이블의 ${id}번 데이터가 성공적으로 삭제되었습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 삭제되었습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Worker.name} 테이블에서 ${id}번 데이터의 삭제를 시도했으나, 해당 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 삭제를 시도했으나, 해당 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Worker.name} 테이블의 ${id}번 데이터를 삭제하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Worker.name} 테이블`
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
                "DELETE /workers/${id}"
            )} (IP: ${IP})`
        );
    }
};
