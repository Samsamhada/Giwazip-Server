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
    let code = req.body.code;
    let token = req.body.token;
    let name = req.body.name;
    console.log("code: " + code);
    console.log("token: " + req.body.token);
    if (!code) {
        res.status(200).json({ message: "Apple Login Try" });
        console.log(
            `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                chalk.bgGreen("Success:") +
                " Apple Login이 시도 되었습니다. (IP: " +
                (req.header("X-FORWARDED-FOR") || req.socket.remoteAddress) +
                ")"
        );
        return;
    }
    const base64DecodedText = Buffer.from(token, "base64").toString("utf8");
    const decodeToken = jwt.decode(base64DecodedText);
    const email = decodeToken.email;

    // Create a Worker
    const worker = {
        userIdentifier: decodeToken.sub,
        name: name,
        email: email,
        number: req.body.number,
    };

    Worker.findOrCreate({
        where: { userIdentifier: decodeToken.sub },
        defaults: {
            userIdentifier: decodeToken.sub,
            name: name,
            email: email,
            number: req.body.number,
        },
    }).then((user, created) => {
        res.status(200).send(user[0]);
        if (user[1]) {
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                    chalk.bgGreen("Success:") +
                    " 회원 가입에 성공했습니다. (IP: " +
                    (req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress) +
                    ")"
            );
        } else {
            console.log(
                `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                    chalk.bgGreen("Success:") +
                    " 로그인에 성공했습니다. (IP: " +
                    (req.header("X-FORWARDED-FOR") ||
                        req.socket.remoteAddress) +
                    ")"
            );
        }
    });
};
