const db = require("../models");
const Photo = db.photos;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const moment = require("moment");
const chalk = require("chalk");

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        // Validate request

        let postID = req.body.postID;
        let url = req.file.location;

        if (!postID || !url) {
            res.status(400).send({
                message: "Photo 테이블의 필수 정보가 누락 되었습니다!",
            });
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                    chalk.bgRed("Error:") +
                    " Photo 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: " +
                    (req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress) +
                    ")"
            );
            return;
        }

        // Create a Status
        const photo = {
            postID: postID,
            url: url,
        };

        Photo.create(photo)
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Photo 테이블에 새로운 데이터가 성공적으로 추가되었습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "새로운 사진을 추가하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "새로운 Photo를 추가하는 중에 문제가 발생했습니다. (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                );
            });
    } else {
        res.status(401).send({ message: "Connection Fail" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgRed("Error:") +
                " Connection Fail at POST /photos (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

// exports.findAll = (req, res) => {
//     if (req.header("API-Key") == apiKey) {
//         Photo.findAll()
//             .then((data) => {
//                 res.send(data);
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgGreen("Success:") +
//                         " Photo 테이블의 모든 데이터를 성공적으로 조회했습니다. (IP: " +
//                         (req.header("X-FORWARDED-FOR") ||
//                             req.socket.remoteAddress) +
//                         ")"
//                 );
//             })
//             .catch((err) => {
//                 res.status(500).send({
//                     message:
//                         err.message ||
//                         "Some error occurred while retrieving photos.",
//                 });
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgRed("Error:") +
//                         " " +
//                         err.message ||
//                         "Some error occurred while retrieving photos. (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                 );
//             });
//     } else {
//         res.status(401).send({ message: "Connection Fail" });
//         console.log(
//             `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                 chalk.bgRed("Error:") +
//                 " Connection Fail at GET /photos (IP: " +
//                 (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
//                 ")"
//         );
//     }
// };

// exports.findOne = (req, res) => {
//     const id = req.params.id;

//     if (req.header("API-Key") == apiKey) {
//         Photo.findByPk(id)
//             .then((data) => {
//                 if (data) {
//                     res.send(data);
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgGreen("Success:") +
//                             ` Photo 테이블의 ${id}번 데이터를 성공적으로 조회했습니다.` +
//                             " (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 } else {
//                     res.status(400).send({
//                         message: `Cannot find Photo with id=${id}.`,
//                     });
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgRed("Error:") +
//                             ` Photo 테이블에서 ${id}번 데이터를 찾을 수 없습니다.` +
//                             " (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 }
//             })
//             .catch((err) => {
//                 res.status(500).send({
//                     message: "Error retrieving Photo with id=" + id,
//                 });
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgRed("Error:") +
//                         " Error retrieving Photo with id=" +
//                         id +
//                         "(IP: " +
//                         (req.header("X-FORWARDED-FOR") ||
//                             req.socket.remoteAddress) +
//                         ")"
//                 );
//             });
//     } else {
//         res.status(401).send({ message: "Connection Fail" });
//         console.log(
//             `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                 chalk.bgRed("Error:") +
//                 ` Connection Fail at GET /photos/${id}` +
//                 " (IP: " +
//                 (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
//                 ")"
//         );
//     }
// };

// exports.findByPostID = (req, res) => {
//     const id = req.params.id;

//     if (req.header("API-Key") == apiKey) {
//         Photo.findAll({ where: { postID: id } })
//             .then((data) => {
//                 res.send(data);
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgGreen("Success:") +
//                         ` Photo 테이블의 postID가 ${id}인 모든 데이터를 성공적으로 조회했습니다.` +
//                         " (IP: " +
//                         (req.header("X-FORWARDED-FOR") ||
//                             req.socket.remoteAddress) +
//                         ")"
//                 );
//             })
//             .catch((err) => {
//                 res.status(500).send({
//                     message:
//                         err.message ||
//                         "Some error occurred while retrieving photos.",
//                 });
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgRed("Error:") +
//                         " " +
//                         err.message ||
//                         "Some error occurred while retrieving photos. (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                 );
//             });
//     } else {
//         res.status(401).send({ message: "Connection Fail" });
//         console.log(
//             `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                 chalk.bgRed("Error:") +
//                 ` Connection Fail at GET /photos/post/${id}` +
//                 " (IP: " +
//                 (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
//                 ")"
//         );
//     }
// };

// exports.update = (req, res) => {
//     const id = req.params.id;

//     if (req.header("API-Key") == apiKey) {
//         Photo.update(req.body, {
//             where: { photoID: id },
//         })
//             .then((num) => {
//                 if (num == 1) {
//                     res.send({
//                         message: "Photo was updated successfully.",
//                     });
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgGreen("Success:") +
//                             " Photo 테이블이 성공적으로 수정되었습니다. (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 } else {
//                     res.send({
//                         message: `Cannot update Photo with id=${id}. Maybe Photo was not found or req.body is empty!`,
//                     });
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgRed("Error:") +
//                             ` Photo 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, 수정을 원하는 데이터 정보가 없습니다!` +
//                             " (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 }
//             })
//             .catch((err) => {
//                 res.status(500).send({
//                     message: "Error updating Photo with id=" + id,
//                 });
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgRed("Error:") +
//                         ` Photo 테이블의 ${id}번을 수정하는 데 오류가 발생했습니다.` +
//                         " (IP: " +
//                         (req.header("X-FORWARDED-FOR") ||
//                             req.socket.remoteAddress) +
//                         ")"
//                 );
//             });
//     } else {
//         res.status(401).send({ message: "Connection Fail" });
//         console.log(
//             `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                 chalk.bgRed("Error:") +
//                 ` Connection Fail at PUT /photos/${id}` +
//                 " (IP: " +
//                 (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
//                 ")"
//         );
//     }
// };

// exports.delete = (req, res) => {
//     const id = req.params.id;

//     if (req.header("API-Key") == apiKey) {
//         Photo.destroy({
//             where: { photoID: id },
//         })
//             .then((num) => {
//                 if (num == 1) {
//                     res.send({
//                         message: "Photo was deleted successfully!",
//                     });
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgGreen("Success:") +
//                             " Photo 테이블에서 해당 데이터가 성공적으로 삭제되었습니다! (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 } else {
//                     res.send({
//                         message: `Cannot delete Photo with id=${id}. Maybe Photo was not found!`,
//                     });
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgRed("Error:") +
//                             ` Photo 테이블에서 ${id}번 데이터를 삭제할 수 없습니다. Photo 테이블에서 해당 데이터를 찾을 수 없습니다.` +
//                             " (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 }
//             })
//             .catch((err) => {
//                 res.status(500).send({
//                     message: "Could not delete Photo with id=" + id,
//                 });
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgRed("Error:") +
//                         ` Photo 테이블의 ${id}번 데이터를 삭제할 수 없습니다.` +
//                         " (IP: " +
//                         (req.header("X-FORWARDED-FOR") ||
//                             req.socket.remoteAddress) +
//                         ")"
//                 );
//             });
//     } else {
//         res.status(401).send({ message: "Connection Fail" });
//         console.log(
//             `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                 chalk.bgRed("Error:") +
//                 ` Connection Fail at DELETE /photos/${id}` +
//                 " (IP: " +
//                 (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
//                 ")"
//         );
//     }
// };
