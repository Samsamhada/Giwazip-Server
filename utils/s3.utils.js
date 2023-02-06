const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const path = require("path");
const moment = require("moment");

const dotenv = require("dotenv");
const chalk = require("chalk");

const reqHeaderIPField = "X-FORWARDED-FOR";
const reqHeaderAPIKeyField = "x-api-key";

const success = `🟢${chalk.green("Success:")}`;
const badAccessError = `🔴${chalk.red("Error:")}`;

dotenv.config();

AWS.config.update({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();

const allowedExtensions = [
    ".png",
    ".PNG",
    ".jpg",
    ".JPG",
    ".jpeg",
    ".JPEG",
    ".bmp",
    ".BMP",
    ".heic",
    ".HEIC",
];

const imageUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: (req, file, callback) => {
            const IP = req.header(reqHeaderIPField) || req.socket.remoteAddress;

            if (req.header(reqHeaderAPIKeyField) == process.env.API_KEY) {
                const uploadDirectory = "photos";
                const extension = path.extname(file.originalname);
                if (!allowedExtensions.includes(extension)) {
                    console.log(
                        `[${moment().format(
                            "YYYY-MM-DD HH:mm:ss.SSS"
                        )}] ${badAccessError} 허용되지 않은 확장자(${chalk.yellow(
                            extension
                        )})로 업로드를 시도했습니다. (IP: ${IP})`
                    );
                    return callback(new Error("wrong extension"));
                }
                console.log(
                    `[${moment().format(
                        "YYYY-MM-DD HH:mm:ss.SSS"
                    )}] ${success} 성공적으로 사진을 업로드 했습니다. (IP: ${IP})`
                );
                callback(
                    null,
                    `${uploadDirectory}/${moment().format(
                        "YYYYMMDDHHmmssSSS"
                    )}-${file.originalname}`
                );
            } else {
                console.log(
                    `[${moment().format(
                        "YYYY-MM-DD HH:mm:ss.SSS"
                    )}] ${badAccessError} Connection Fail at Image Uploader (IP: ${IP})`
                );
                return callback(new Error("Connection Fail"));
            }
        },
        acl: "public-read-write",
    }),
});

module.exports = imageUploader;
