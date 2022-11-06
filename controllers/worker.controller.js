const db = require("../models");
const Worker = db.workers;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.userIdentifier || !req.body.name || !req.body.email) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        console.log(
            "Error: Worker 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다."
        );
        return;
    }

    // Create a Worker
    const worker = {
        userIdentifier: req.body.userIdentifier,
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
    };

    Worker.create(worker)
        .then((data) => {
            res.send(data);
            console.log(
                "Worker 테이블에 새로운 데이터가 성공적으로 추가되었습니다."
            );
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Worker.",
            });
            console.log(
                err.message || "Some error occurred while creating the Worker."
            );
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Worker.findAll({ where: condition })
        .then((data) => {
            res.send(data);
            console.log(
                "Worker 테이블의 모든 데이터를 성공적으로 조회했습니다."
            );
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving workers.",
            });
            console.log(
                err.message || "Some error occurred while retrieving workers."
            );
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Worker.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
                console.log(
                    `Worker 테이블의 ${id}번 데이터를 성공적으로 조회했습니다.`
                );
            } else {
                res.status(400).send({
                    message: `Cannot find Worker with id=${id}.`,
                });
                console.log(
                    `Worker 테이블에서 ${id}번 데이터를 찾을 수 없습니다.`
                );
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving Worker with id=" + id,
            });
            console.log("Error retrieving Worker with id=" + id);
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Worker.update(req.body, {
        where: { workerID: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Worker was updated successfully.",
                });
                console.log("Worker 테이블이 성공적으로 수정되었습니다.");
            } else {
                res.send({
                    message: `Cannot update Worker with id=${id}. Maybe Worker was not found or req.body is empty!`,
                });
                console.log(
                    `Worker 테이블의 ${id}번 데이터를 수정할 수 없습니다. 해당 데이터를 찾을 수 없거나, 수정을 원하는 데이터 정보가 없습니다.`
                );
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Worker with id=" + id,
            });
            console.log(
                `Error: Worker 테이블의 ${id}번 데이터를 수정하는데 오류가 발생했습니다.`
            );
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Worker.destroy({
        where: { workerID: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Worker was deleted successfully!",
                });
                console.log(
                    "Worker 테이블에서 해당 데이터가 성공적으로 삭제되었습니다."
                );
            } else {
                res.send({
                    message: `Cannot delete Worker with id=${id}. Maybe Worker was not found!`,
                });
                console.log(
                    `Worker 테이블에서 ${id}번 데이터를 삭제할 수 없습니다. Worker 테이블에서 해당 데이터를 찾을 수 없습니다.`
                );
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Worker with id=" + id,
            });
            console.log(`Worker 테이블의 ${id}번 데이터를 삭제할 수 없습니다.`);
        });
};
