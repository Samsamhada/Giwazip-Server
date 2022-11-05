const db = require("../models");
const Worker = db.workers;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.userIdentifier || !req.body.name || !req.body.email) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
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
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Worker.",
            });
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Worker.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving workers.",
            });
        });
};
