const db = require("../models");
const Worker = db.workers;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const moment = require("moment");
const chalk = require("chalk");

dotenv.config();

const apiKey = process.env.API_KEY;

exports.create = (req, res) => {
    if (req.header("API-Key") == apiKey) {
        // Validate request

        let userID = req.body.userID;
        let userIdentifier = req.body.userIdentifier;
        let name = req.body.name;
        let email = req.body.email;

        if (!userID || !userIdentifier || !name || !email) {
            res.status(400).send({
                message: "Worker 테이블의 필수 정보가 누락 되었습니다!",
            });
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                    chalk.bgRed("Error:") +
                    " Worker 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다. (IP: " +
                    (req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress) +
                    ")"
            );
            return;
        }

        // Create a Worker
        const worker = {
            userID: userID,
            userIdentifier: userIdentifier,
            name: name,
            email: email,
        };

        Worker.create(worker)
            .then((data) => {
                res.send(data);
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        " Worker 테이블에 새로운 데이터가 성공적으로 추가되었습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "새로운 업자 정보를 추가하는 중에 문제가 발생했습니다.",
                });
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " " +
                        err.message ||
                        "새로운 Worker 정보를 추가하는 중에 문제가 발생했습니다. (IP: " +
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
                " Connection Fail at POST /workers (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
    }
};

// exports.findAll = (req, res) => {
//     if (req.header("API-Key") == apiKey) {
//         Worker.findAll()
//             .then((data) => {
//                 res.send(data);
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgGreen("Success:") +
//                         " Worker 테이블의 모든 데이터를 성공적으로 조회했습니다. (IP: " +
//                         (req.header("X-FORWARDED-FOR") ||
//                             req.socket.remoteAddress) +
//                         ")"
//                 );
//             })
//             .catch((err) => {
//                 res.status(500).send({
//                     message:
//                         err.message ||
//                         "Some error occurred while retrieving workers.",
//                 });
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgRed("Error:") +
//                         " " +
//                         err.message ||
//                         "Some error occurred while retrieving workers. (IP: " +
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
//                 " Connection Fail at GET /workers (IP: " +
//                 (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
//                 ")"
//         );
//     }
// };

// exports.findOne = (req, res) => {
//     const id = req.params.id;

//     if (req.header("API-Key") == apiKey) {
//         Worker.findByPk(id)
//             .then((data) => {
//                 if (data) {
//                     res.send(data);
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgGreen("Success:") +
//                             ` Worker 테이블의 ${id}번 데이터를 성공적으로 조회했습니다. (IP: ` +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 } else {
//                     res.status(400).send({
//                         message: `Cannot find Worker with id=${id}.`,
//                     });
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgRed("Error:") +
//                             ` Worker 테이블에서 ${id}번 데이터를 찾을 수 없습니다.` +
//                             " (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 }
//             })
//             .catch((err) => {
//                 res.status(500).send({
//                     message: "Error retrieving Worker with id=" + id,
//                 });
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgRed("Error:") +
//                         ` Error retrieving Worker with id=${id}`
//                 );
//             });
//     } else {
//         res.status(401).send({ message: "Connection Fail" });
//         console.log(
//             `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                 chalk.bgRed("Error: ") +
//                 ` Connection Fail at GET /workers/${id}` +
//                 " (IP: " +
//                 (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
//                 ")"
//         );
//     }
// };

// exports.update = (req, res) => {
//     const id = req.params.id;

//     if (req.header("API-Key") == apiKey) {
//         Worker.update(req.body, {
//             where: { workerID: id },
//         })
//             .then((num) => {
//                 if (num == 1) {
//                     res.send({
//                         message: "Worker was updated successfully.",
//                     });
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgGreen("Success:") +
//                             " Worker 테이블이 성공적으로 수정되었습니다. (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 } else {
//                     res.send({
//                         message: `Cannot update Worker with id=${id}. Maybe Worker was not found or req.body is empty!`,
//                     });
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgRed("Error:") +
//                             ` Worker 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, 수정을 원하는 데이터 정보가 없습니다.` +
//                             " (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 }
//             })
//             .catch((err) => {
//                 res.status(500).send({
//                     message: "Error updating Worker with id=" + id,
//                 });
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgRed("Error:") +
//                         ` Worker 테이블의 ${id}번 데이터를 수정하는데 오류가 발생했습니다.` +
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
//                 ` Connection Fail at PUT /workers/${id}` +
//                 " (IP: " +
//                 (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
//                 ")"
//         );
//     }
// };

// exports.delete = (req, res) => {
//     const id = req.params.id;

//     if (req.header("API-Key") == apiKey) {
//         Worker.destroy({
//             where: { workerID: id },
//         })
//             .then((num) => {
//                 if (num == 1) {
//                     res.send({
//                         message: "Worker was deleted successfully!",
//                     });
//                     console.log(
//                         `[${moment().format(
//                             "YYYY-MM-DD HH:mm:ss.SSS"
//                         )}] Worker 테이블에서 해당 데이터가 성공적으로 삭제되었습니다.` +
//                             " (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 } else {
//                     res.send({
//                         message: `Cannot delete Worker with id=${id}. Maybe Worker was not found!`,
//                     });
//                     console.log(
//                         `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                             chalk.bgRed("Error:") +
//                             ` Worker 테이블에서 ${id}번 데이터를 삭제할 수 없습니다. Worker 테이블에서 해당 데이터를 찾을 수 없습니다.` +
//                             " (IP: " +
//                             (req.header("X-FORWARDED-FOR") ||
//                                 req.socket.remoteAddress) +
//                             ")"
//                     );
//                 }
//             })
//             .catch((err) => {
//                 res.status(500).send({
//                     message: "Could not delete Worker with id=" + id,
//                 });
//                 console.log(
//                     `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
//                         chalk.bgRed("Error:") +
//                         ` Worker 테이블의 ${id}번 데이터를 삭제할 수 없습니다.` +
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
//                 ` Connection Fail at DELETE /workers/${id}` +
//                 " (IP: " +
//                 (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
//                 ")"
//         );
//     }
// };
