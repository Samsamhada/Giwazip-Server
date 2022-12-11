const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const path = require("path");
const moment = require("moment");

const dotenv = require("dotenv");
const chalk = require("chalk");

dotenv.config();

AWS.config.update({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();

const allowedExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".bmp",
    ".PNG",
    ".JPG",
    ".JPEG",
    ".BMP",
    ".heic",
    ".HEIC",
];

const imageUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: (req, file, callback) => {
            if (req.header("API-Key") == process.env.API_KEY) {
                const uploadDirectory = "photos";
                const extension = path.extname(file.originalname);
                if (!allowedExtensions.includes(extension)) {
                    console.log(
                        `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                            chalk.bgRed("Error:") +
                            " Not Allowed Extension (IP: " +
                            (req.header("X-FORWARDED-FOR") ||
                                req.socket.remoteAddress) +
                            ")"
                    );
                    return callback(new Error("wrong extension"));
                }
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Request:") +
                        `${req} (IP: ` +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("File:") +
                        `${file} (IP: ` +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgGreen("Success:") +
                        "사진 업로드에 성공했습니다. (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
                callback(
                    null,
                    `${uploadDirectory}/${moment().format(
                        "YYYYMMDDHHmmssSSS"
                    )}-${file.originalname}`
                );
            } else {
                console.log(
                    `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ` +
                        chalk.bgRed("Error:") +
                        " Connection Fail at Image Uploader (IP: " +
                        (req.header("X-FORWARDED-FOR") ||
                            req.socket.remoteAddress) +
                        ")"
                );
                return callback(new Error("Connection Fail"));
            }
        },
        acl: "public-read-write",
    }),
});

module.exports = imageUploader;
