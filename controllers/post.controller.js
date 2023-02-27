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
const reqHeaderAPIKeyField = "x-api-key";
const asc = "ASC";

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        const roomID = req.body.roomID;
        const userID = req.body.userID;
        const categoryID = req.body.categoryID;

        if (!roomID || !userID || !categoryID) {
            res.status(400).send({
                message: `${Post.name} 테이블의 필수 정보가 누락 되었습니다.`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${Post.name} 테이블`
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
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${Post.name} 테이블`
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `새로운 ${Post.name}를 추가하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} 새로운 ${chalk.yellow(
                        Post.name
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
                "POST /posts"
            )} (IP: ${IP})`
        );
    }
};

exports.createWithPhotos = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        const roomID = req.body.roomID;
        const userID = req.body.userID;
        const categoryID = req.body.categoryID;
        let photos = [];

        for (idx = 0; idx < req.files.length; idx++) {
            photos.push({ url: req.files[idx].location });

            if (!photos[idx].url) {
                res.status(400).send({
                    message: `${Post.name} + ${Photo.name} 테이블의 필수 정보 사진 경로가 누락 되었습니다. 이는 사진 업로드 중에 문제가 생겼거나, 사진을 제외하고 업로드를 시도했을 수 있습니다.`,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${badAccessError} ${chalk.yellow(
                        `${Post.name} + ${Photo.name} 테이블`
                    )}의 필수 데이터 url을 포함하지 않고 Create를 시도했습니다. 이는 사진 업로드 중에 문제가 생겼거나, 사진을 제외하고 업로드를 시도했을 수 있습니다. (IP: ${IP})`
                );
                return;
            }
        }

        if (!photos) {
            res.status(400).send({
                message: `${Post.name} + ${Photo.name} 테이블의 필수 정보 사진 정보가 누락 되었습니다. 이는 사진 업로드 중에 문제가 생겼거나, 사진을 제외하고 업로드를 시도했을 수 있습니다.`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${Post.name} + ${Photo.name} 테이블`
                )}의 필수 데이터 photos를 포함하지 않고 Create를 시도했습니다. 이는 사진 업로드 중에 문제가 생겼거나, 사진을 제외하고 업로드를 시도했을 수 있습니다. (IP: ${IP})`
            );
            return;
        }

        if (!roomID || !userID || !categoryID) {
            res.status(400).send({
                message: `${Post.name} + ${Photo.name} 테이블의 필수 정보가 누락 되었습니다.`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${Post.name} + ${Photo.name} 테이블`
                )}의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: ${IP})`
            );
            return;
        }

        const postPhoto = {
            roomID: roomID,
            userID: userID,
            categoryID: categoryID,
            description: req.body.description,
            photos: photos,
        };

        Post.create(postPhoto, { include: [{ model: Photo, as: "photos" }] })
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${Post.name} + ${Photo.name} 테이블`
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Post.name} + ${Photo.name} 테이블에 새로운 데이터를 추가하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Post.name} + ${Photo.name} 테이블`
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
                "POST /posts/photo"
            )} (IP: ${IP})`
        );
    }
};

exports.findAll = (req, res) => {
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Post.findAll({
            order: [
                ["postID", asc],
                ["photos", "photoID", asc],
            ],
            include: [
                {
                    model: Photo,
                    as: "photos",
                    attributes: ["photoID", "url"],
                },
            ],
        })
            .then((data) => {
                res.status(200).send(data);
                console.log(
                    `[${moment().format(dateFormat)}] ${success} ${chalk.yellow(
                        `${Post.name} + ${Photo.name} 테이블`
                    )}의 모든 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Post.name} + ${Photo.name} 테이블을 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Post.name} + ${Photo.name} 테이블`
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
                "GET /posts"
            )} (IP: ${IP})`
        );
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Post.findOne({
            where: { postID: id },
            order: [["photos", "photoID", asc]],
            include: [
                {
                    model: Photo,
                    as: "photos",
                    attributes: ["photoID", "url"],
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
                            `${Post.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Post.name} + ${Photo.name} 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Post.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Post.name} + ${Photo.name} 테이블의 ${id}번 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Post.name} + ${Photo.name} 테이블`
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
                `GET /posts/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.findOneWithUser = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Post.findOne({
            where: { postID: id },
            attributes: [
                "postID",
                "roomID",
                "categoryID",
                "description",
                "createDate",
            ],
            order: [
                ["user", "userID", asc],
                ["photos", "photoID", asc],
            ],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["userID", "number"],
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
                if (data) {
                    res.status(200).send(data);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Post.name} + ${User.name} + ${Worker.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `postID=${id}`
                        )}인 데이터를 성공적으로 조회했습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Post.name} + ${User.name} + ${Worker.name} + ${Photo.name} 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Post.name} + ${User.name} + ${Worker.name} + ${Photo.name} 테이블`
                        )}의 ${chalk.yellow(
                            `postID=${id}`
                        )}인 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Post.name} + ${User.name} + ${Worker.name} + ${Photo.name} 테이블의 postID=${id}인 데이터를 조회하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Post.name} + ${User.name} + ${Worker.name} + ${Photo.name} 테이블`
                    )}의 ${chalk.yellow(
                        `postID=${id}`
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
                `GET /posts/user/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;
    const roomID = req.body.roomID;
    const userID = req.body.userID;
    const categoryID = req.body.categoryID;
    const description = req.body.description;
    const createDate = req.body.createDate;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        if (createDate) {
            res.status(400).send({
                message: `${Post.name} 테이블의 ${id}번 데이터의 createDate를 ${createDate}로 변경할 수 없습니다.`,
            });
            console.log(
                `[${moment().format(
                    dateFormat
                )}] ${badAccessError} ${chalk.yellow(
                    `${Post.name} 테이블`
                )}의 ${chalk.yellow(
                    `${id}번`
                )} 데이터의 createDate를 ${chalk.yellow(
                    createDate
                )}로 변경할 수 없습니다. (IP: ${IP})`
            );
            return;
        }

        Post.update(req.body, {
            where: { postID: id },
            returning: true,
        })
            .then((data) => {
                if (data[0] == 1) {
                    res.status(200).send(data[1][0]);
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Post.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else if (!roomID && !userID && !categoryID && !description) {
                    res.status(400).send({
                        message: `${Post.name} 테이블의 ${id}번 데이터의 수정을 시도했으나, request의 body가 비어있어 수정할 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Post.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했으나, request의 body가 비어있어 수정할 수 없습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Post.name} 테이블의 ${id}번 데이터의 수정을 시도했으나, 해당 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Post.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 수정을 시도했으나, 해당 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Post.name} 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Post.name} 테이블`
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
                `PUT /posts/${id}`
            )} (IP: ${IP})`
        );
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

    if (req.header(reqHeaderAPIKeyField) == apiKey) {
        Post.destroy({
            where: { postID: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.status(200).send({
                        message: `${Post.name} 테이블의 ${id}번 데이터가 성공적으로 삭제되었습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${success} ${chalk.yellow(
                            `${Post.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터가 성공적으로 삭제되었습니다. (IP: ${IP})`
                    );
                } else {
                    res.status(404).send({
                        message: `${Post.name} 테이블에서 ${id}번 데이터의 삭제를 시도했으나, 해당 데이터를 찾을 수 없습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            dateFormat
                        )}] ${badAccessError} ${chalk.yellow(
                            `${Post.name} 테이블`
                        )}의 ${chalk.yellow(
                            `${id}번`
                        )} 데이터의 삭제를 시도했으나, 해당 데이터를 찾을 수 없습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `${Post.name} 테이블의 ${id}번 데이터를 삭제하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format(
                        dateFormat
                    )}] ${unknownError} ${chalk.yellow(
                        `${Post.name} 테이블`
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
                `DELETE /posts/${id}`
            )} (IP: ${IP})`
        );
    }
};
