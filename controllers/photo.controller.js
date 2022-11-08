const db = require("../models");
const Photo = db.photos;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.postID) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        console.log(
            "Error: Photo 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다."
        );
        return;
    }

    // Create a Status
    const photo = {
        postID: req.body.postID,
        photoPath: `${req.file.location}`,
    };

    Photo.create(photo)
        .then((data) => {
            res.send(data);
            console.log(
                "Photo 테이블에 새로운 데이터가 성공적으로 추가되었습니다."
            );
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Photo.",
            });
            console.log(
                err.message || "Some error occurred while creating the Photo."
            );
        });
};

exports.findAll = (req, res) => {
    Photo.findAll()
        .then((data) => {
            res.send(data);
            console.log(
                "Photo 테이블의 모든 데이터를 성공적으로 조회했습니다."
            );
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving photos.",
            });
            console.log(
                err.message || "Some error occurred while retrieving photos."
            );
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Photo.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
                console.log(
                    `Photo 테이블의 ${id}번 데이터를 성공적으로 조회했습니다.`
                );
            } else {
                res.status(400).send({
                    message: `Cannot find Photo with id=${id}.`,
                });
                console.log(
                    `Photo 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`
                );
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving Photo with id=" + id,
            });
            console.log("Error retrieving Photo with id=" + id);
        });
};

