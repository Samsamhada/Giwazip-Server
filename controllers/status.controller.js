const db = require("../models");
const Status = db.statuses;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.roomID || req.body.category < 0) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        console.log(
            "Error: Status 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다."
        );
        return;
    }

    // Create a Status
    const status = {
        roomID: req.body.roomID,
        category: req.body.category,
        status: 0,
    };

    Status.create(status)
        .then((data) => {
            res.send(data);
            console.log(
                "Status 테이블에 새로운 데이터가 성공적으로 추가되었습니다."
            );
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Status.",
            });
            console.log(
                err.message || "Some error occurred while creating the Status."
            );
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Status.findAll({ where: condition })
        .then((data) => {
            res.send(data);
            console.log(
                "Status 테이블의 모든 데이터를 성공적으로 조회했습니다."
            );
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving statuses.",
            });
            console.log(
                err.message || "Some error occurred while retrieving statuses."
            );
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Status.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
                console.log(
                    `Status 테이블의 ${id}번 데이터를 성공적으로 조회했습니다.`
                );
            } else {
                res.status(400).send({
                    message: `Cannot find Status with id=${id}.`,
                });
                console.log(
                    `Status 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`
                );
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving Status with id=" + id,
            });
            console.log("Error retrieving Status with id=" + id);
        });
};

