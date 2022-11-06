const db = require("../models");
const Status = db.statuses;
const Op = db.Sequelize.Op;

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

