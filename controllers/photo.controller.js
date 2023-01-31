const db = require("../models");
const Photo = db.photos;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const moment = require("moment");
const chalk = require("chalk");
const purple = chalk.hex("#9900ff");

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    const IP = req.header("X-FORWARDED-FOR") || req.socket.remoteAddress;

    if (req.header("API-Key") == apiKey) {
        let postID = req.body.postID;
        let url = req.file.location;

        if (!postID || !url) {
            res.status(400).send({
                message: "Photo 테이블의 필수 정보가 누락 되었습니다!",
            });
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] 🔴${chalk.red(
                    "Error:"
                )} ${chalk.yellow(
                    "Photo 테이블"
                )}의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: ${IP})`
            );
            return;
        }

        const photo = {
            postID: postID,
            url: url,
        };

        Photo.create(photo)
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format(
                        "YYYY-MM-DD HH:mm:ss.SSS"
                    )}] 🟢${chalk.green("Success:")} ${chalk.yellow(
                        "Photo 테이블"
                    )}에 새로운 데이터가 성공적으로 추가되었습니다. (IP: ${IP})`
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        "새로운 Photo를 추가하는 중에 문제가 발생했습니다.",
                    detail: err.message,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] 🟣${purple(
                        "Error:"
                    )} 새로운 ${chalk.yellow(
                        "Photo"
                    )}를 추가하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "상세정보: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] 🔴${chalk.red(
                "Error:"
            )} Connection Fail at ${chalk.yellow("POST /photos")} (IP: ${IP})`
        );
    }
};

exports.update = (req, res) => {
    const id = req.params.id;
    const IP = req.header("X-FORWARDED-FOR") || req.socket.remoteAddress;

    if (req.header("API-Key") == apiKey) {
        Photo.update(req.body, {
            where: { photoID: id },
            returning: true,
        })
            .then((data) => {
                if (data[0] == 1) {
                    res.send(data[1][0]);
                    console.log(
                        `[${moment().format(
                            "YYYY-MM-DD HH:mm:ss.SSS"
                        )}] 🟢${chalk.green("Success:")} ${chalk.yellow(
                            "Photo 테이블"
                        )}의 ${chalk.yellow(
                            id + "번"
                        )} 데이터가 성공적으로 수정되었습니다. (IP: ${IP})`
                    );
                } else {
                    res.send({
                        message: `Photo 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다.`,
                    });
                    console.log(
                        `[${moment().format(
                            "YYYY-MM-DD HH:mm:ss.SSS"
                        )}] 🔴${chalk.red("Error:")} ${chalk.yellow(
                            "Photo 테이블"
                        )}의 ${chalk.yellow(
                            id + "번"
                        )} 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, request의 body가 비어있습니다. (IP: ${IP})`
                    );
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `Photo 테이블의 ${id}번 데이터를 수정하는 중에 문제가 발생했습니다.`,
                    detail: err.message,
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] 🟣${purple(
                        "Error:"
                    )} ${chalk.yellow("Photo 테이블")}의 ${chalk.yellow(
                        id + "번"
                    )} 데이터를 수정하는 중에 문제가 발생했습니다. ${chalk.dim(
                        "상세정보: " + err.message
                    )} (IP: ${IP})`
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] 🔴${chalk.red(
                "Error:"
            )} Connection Fail at ${chalk.yellow(
                "PUT /photos/" + id
            )} (IP: ${IP})`
        );
    }
};
