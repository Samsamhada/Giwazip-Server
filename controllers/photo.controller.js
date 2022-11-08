const db = require("../models");
const Photo = db.photos;
const Op = db.Sequelize.Op;

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

