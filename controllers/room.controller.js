const db = require("../models");
const Room = db.rooms;
const Op = db.Sequelize.Op;

    function generateRandomString(stringLength = 6) {
        const characters =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let randomString = "";

        for (let i = 0; i < stringLength; i++) {
            const randomNumber = Math.floor(Math.random() * characters.length);
            randomString += characters.substring(
                randomNumber,
                randomNumber + 1
            );
        }

        return randomString;
    }
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Room.findAll({ where: condition })
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
