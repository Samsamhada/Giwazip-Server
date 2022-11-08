const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const path = require("path");
const moment = require("moment");

const dotenv = require("dotenv");

dotenv.config();

AWS.config.update({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();

const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp"];

const imageUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: "giwazip-image",
        key: (req, file, callback) => {
            const uploadDirectory = "photos";
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error("wrong extension"));
            }
            callback(
                null,
                `${uploadDirectory}/${moment().format("YYYYMMDDHHmmssSSS")}-${
                    file.originalname
                }`
            );
        },
        acl: "public-read-write",
    }),
});

module.exports = imageUploader;
