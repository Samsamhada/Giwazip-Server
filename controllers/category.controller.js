const db = require("../models");
const Category = db.categories;
const Post = db.posts;
const Photo = db.photos;
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
const reqHeaderAPIKeyField = "x-api-key";
const asc = "ASC";

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField)) {
        let roomID = req.body.roomID;
        let name = req.body.name;

        if (!roomID || !name) {
            res.status(400).send({
                message: `${Category.name} 테이블의 필수 정보가 누락 되었습니다!`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${Category.name} 테이블`
                )}의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: ${IP})`
            );
            return;
        }

        const category = {
            roomID: roomID,
            name: name,
            progress: 0,
        };

        Category.create(category)
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${Category.name} 테이블`
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `새로운 ${Category.name}를 추가하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} 새로운 ${chalk.yellow(
                        Category.name
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
            )}] ${badAccessError}} Connection Fail at ${chalk.yellow(
                "POST /categories"
            )} (IP: ${IP})`
        );
    }
};

exports.findAll = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Category.findAll({ order: [["categoryID", asc]] })
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${Category.name} 테이블`
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Category.name} 테이블을 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Category.name} 테이블`
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
                "GET /categories"
            )} (IP: ${IP})`
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Category.findByPk(id)
            .then((data) => {
                if (data) {
                    res.status(200).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Category.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Category.name} 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Category.name} 테이블`
                        )}에서 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Category.name} 테이블의 ${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Category.name} 테이블`
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
                `GET /categories/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithPost = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Category.findOne({
            where: { categoryID: id },
            order: [[Post, "postID", asc]],
            include: [
                {
                    model: Post,
                    attributes: [
                        "postID",
                        "userID",
                        "categoryID",
                        "description",
                        "createDate",
                    ],
                    order: [[Photo, "photoID", asc]],
                    include: [
                        {
                            model: Photo,
                            attributes: ["photoID", "url"],
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
                            `${Category.name} + ${Post.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `categoryID=${id}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Category.name} + ${Post.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `categoryID=${id}`
                        )}인 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Category.name} + ${Post.name} + ${Photo.name} 테이블의 categoryID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Category.name} + ${Post.name} + ${Photo.name} 테이블`
                    )}의 ${chalk.yellow(
                        `categoryID=${id}`
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
                `GET /categories/post/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;
    const roomID = req.body.roomID;
    const name = req.body.name;
    const progress = req.body.progress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Category.update(req.body, {
            where: { categoryID: id },
            returning: true,
        })
            .then((data) => {
                if (data[0] == 1) {
                    res.status(200).send(data[1][0]);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Category.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else if (!roomID && !name && !progress) {
                    res.status(400).send({
                        message: `${Category.name} 테이블의 ${id}번 데이터의 수정을 시도했으나, request의 body가 비어있어 수정할 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Category.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했으나, request의 body가 비어있어 수정할 수 없습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Category.name} 테이블의 ${id}번 데이터의 수정을 시도했으나, 해당 데이터를 찾을 수 없있습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Category.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했으나, 해당 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Category.name} 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Category.name} 테이블`
                    )}의 ${chalk.yellow(
                        `${id}번`
                    )} 데이터를 수정하는 중에 문제가 발생했습니다. (IP: ${IP})`
                );
            });
    } else {
        res.status(403).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format(
                dateFormat
            )}] ${badAccessError} Connection Fail at ${chalk.yellow(
                `PUT /categories/${id}`
            )} (IP: ${IP})`
        );
    }
};
