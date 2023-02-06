const db = require("../models");
const Room = db.rooms;
const Category = db.categories;
const Post = db.posts;
const Photo = db.photos;
const UserRoom = db.userrooms;
const User = db.users;
const Worker = db.workers;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const chalk = require("chalk");
const moment = require("moment");
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
        if (!req.body.name) {
            res.status(400).send({
                message: "시공하려는 고객의 별칭이 포함되지 않았습니다!",
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${Room.name} 테이블`
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
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${Room.name} 테이블`
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `새로운 ${Room.name}을 추가하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${badAccessError} 새로운 ${chalk.yellow(
                        Room.name
                    )}을 추가하는 중에 문제가 발생했습니다. ${chalk.dim(
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
                "POST /rooms"
            )} (IP: ${IP})`
        );
    }
};

exports.findAll = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Room.findAll({ order: [["roomID", asc]] })
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${Room.name} 테이블`
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Room.name} 테이블을 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Room.name} 테이블`
                    )}을 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
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
                "GET /rooms"
            )} (IP: ${IP})`
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    const IP = req.header("X-FORWARDE-FOR") || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Room.findByPk(id)
            .then((data) => {
                if (data) {
                    res.status(200).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Room.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Room.name} 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Room.name} 테이블`
                        )}에서 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Room.name} 테이블의 ${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Room.name} 테이블`
                    )}의 ${chalk.yellow(
                        `${id}번`
                    )} 데이터를 조회하는 중에 문제가 발생했습니다. ${chalk.dim(
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
                `GET /rooms/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithCategory = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Room.findOne({
            where: { roomID: id },
            order: [["categories", "categoryID", asc]],
            include: [
                {
                    model: Category,
                    as: "categories",
                    attributes: ["categoryID", "name", "progress"],
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
                            `${Room.name} + ${Category.name} 테이블`
                        )}의 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Room.name} + ${Category.name} 테이블에서 roomID=${id}인 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Room.name} + ${Category.name} 테이블`
                        )}에서 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Room.name} + ${Category.name} 테이블의 roomID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Room.name} + ${Category.name} 테이블`
                    )}의 ${chalk.yellow(
                        `roomID=${id}`
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
                `GET /rooms/category/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithPost = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Room.findOne({
            where: { roomID: id },
            order: [["posts", "postID", asc]],
            include: [
                {
                    model: Post,
                    as: "posts",
                    attributes: [
                        "postID",
                        "userID",
                        "categoryID",
                        "description",
                        "createDate",
                    ],
                    order: [["photos", "photoID", asc]],
                    include: [
                        {
                            model: Photo,
                            as: "photos",
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
                            `${Room.name} + ${Post.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Room.name} + ${Post.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Room.name} + ${Post.name} + ${Photo.name} 테이블의 roomID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Room.name} + ${Post.name} + ${Photo.name} 테이블`
                    )}의 ${chalk.yellow(
                        `roomID=${id}`
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
                `GET /rooms/post/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithCategoryAndPost = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Room.findOne({
            where: { roomID: id },
            order: [["categories", "categoryID", asc]],
            include: [
                {
                    model: Category,
                    as: "categories",
                    attributes: ["categoryID", "name", "progress"],
                    order: [["posts", "postID", asc]],
                    include: [
                        {
                            model: Post,
                            as: "posts",
                            attributes: [
                                "postID",
                                "userID",
                                "description",
                                "createDate",
                            ],
                            order: [["photos", "photoID", asc]],
                            include: [
                                {
                                    model: Photo,
                                    as: "photos",
                                    attributes: ["photoID", "url"],
                                },
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
                            `${Room.name} + ${Category.name} + ${Post.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Room.name} + ${Category.name} + ${Post.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Room.name} + ${Category.name} + ${Post.name} + ${Photo.name} 테이블의 roomID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Room.name} + ${Category.name} + ${Post.name} + ${Photo.name} 테이블`
                    )}의 ${chalk.yellow(
                        `roomID=${id}`
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
                `GET /rooms/category-post/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithPostAndCategory = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Room.findOne({
            where: { roomID: id },
            order: [["posts", "postID", asc]],
            include: [
                {
                    model: Post,
                    as: "posts",
                    attributes: [
                        "postID",
                        "userID",
                        "description",
                        "createDate",
                    ],
                    order: [["photos", "photoID", asc]],
                    include: [
                        {
                            model: Category,
                            as: "category",
                            attributes: ["categoryID", "name"],
                        },
                        {
                            model: Photo,
                            as: "photos",
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
                            `${Room.name} + ${Post.name} + ${Category.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Room.name} + ${Post.name} + ${Category.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Room.name} + ${Post.name} + ${Category.name} + ${Photo.name} 테이블의 roomID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Room.name} + ${Post.name} + ${Category.name} + ${Photo.name} 테이블`
                    )}의 ${chalk.yellow(
                        `roomID=${id}`
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
                `GET /rooms/post-category/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithUser = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Room.findOne({
            where: { roomID: id },
            order: [["userrooms", "userID", asc]],
            include: [
                {
                    model: UserRoom,
                    as: "userrooms",
                    attributes: ["userID"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["number"],
                            include: [
                                {
                                    model: Worker,
                                    as: "worker",
                                    attributes: [
                                        "userIdentifier",
                                        "name",
                                        "email",
                                    ],
                                },
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
                            `${Room.name} + ${UserRoom.name} + ${User.name} + ${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Room.name} + ${UserRoom.name} + ${User.name} + ${Worker.name} 테이블`
                        )}의 ${chalk.yellow(
                            `roomID=${id}`
                        )}인 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Room.name} + ${UserRoom.name} + ${User.name} + ${Worker.name} 테이블의 roomID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Room.name} + ${UserRoom.name} + ${User.name} + ${Worker.name} 테이블`
                    )}의 ${chalk.yellow(
                        `roomID=${id}`
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
                `GET /rooms/user/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;
    const name = req.body.name;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const warrantyTime = req.body.warrantyTime;
    const inviteCode = req.body.inviteCode;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        if (inviteCode) {
            res.status(400).send({
                message: `${Room.name} 테이블의 ${id}번 데이터의 inviteCode를 ${inviteCode}로 변경할 수 없습니다.`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${Room.name} 테이블`
                )}의 ${chalk.yellow(
                    `${id}번`
                )} 데이터의 inviteCode를 ${chalk.yellow(
                    inviteCode
                )}로 변경할 수 없습니다. (IP: ${IP})`
            );
            return;
        }

        Room.update(req.body, {
            where: { roomID: id },
            returning: true,
        })
            .then((data) => {
                if (data[0] == 1) {
                    res.status(200).send(data[1][0]);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Room.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else if (!name && !startDate && !endDate && !warrantyTime) {
                    res.status(400).send({
                        message: `${Room.name} 테이블의 ${id}번 데이터의 수정을 시도했으나, request의 body가 비어있어 수정할 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Room.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했으나, request의 body가 비어있어 수정할 수 없습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Room.name} 테이블의 ${id}번 데이터의 수정을 시도했으나, 해당 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Room.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했으나, 해당 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Room.name} 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Room.name} 테이블`
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
                `PUT /rooms/${id}`
            )} (IP: ${IP})`
        );
    }
};
