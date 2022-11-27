const db = require("../models");
const Worker = db.workers;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const moment = require("moment");
const chalk = require("chalk");

const jwt = require("jsonwebtoken");
const path = require("path");
const AppleAuth = require("apple-auth");
const appleConfig = require("../config/apple_auth.config.json");
const auth = new AppleAuth(
    appleConfig,
    path.join(__dirname, `../config/${appleConfig.private_key_path}`)
);

dotenv.config();

exports.appleAuth = async (req, res) => {
    let { code } = req.body;
    if (!code) {
        res.status(200).json(NULL_VALUE);
        return;
    }
    const response = await auth.accessToken(code);
    const idToken = jwt.decode(response.id_token);
    const name = idToken.name;
    const email = idToken.email;
    const sub = idToken.sub;

    if (!name) {
        name = "익명의 유저";
    }

    if (!email) {
        email = "";
    }

    // Create a Worker
    const worker = {
        userIdentifier: sub,
        name: name,
        email: email,
        number: req.body.number,
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
                    "Some error occurred while creating the Worker.",
            });
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                    chalk.bgRed("Error:") +
                    " " +
                    err.message ||
                    "Some error occurred while creating the Worker. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
            );
        });
};
