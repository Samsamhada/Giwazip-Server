const db = require("../models");
const Post = db.posts;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (
        !req.body.roomID ||
        req.body.category < 0 ||
        req.body.type < 0 ||
        req.body.type > 1
    ) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        console.log(
            "Error: Post 테이블의 필수 데이터를 포함하지 않고 Create를 시도했습니다."
        );
        return;
    }

    // Create a Status
    const post = {
        roomID: req.body.roomID,
        category: req.body.category,
        type: req.body.type,
        description: req.body.description,
        createData: req.body.createData,
    };

    Post.create(post)
        .then((data) => {
            res.send(data);
            console.log(
                "Post 테이블에 새로운 데이터가 성공적으로 추가되었습니다."
            );
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Post.",
            });
            console.log(
                err.message || "Some error occurred while creating the Post."
            );
        });
};

exports.findAll = (req, res) => {
    Post.findAll()
        .then((data) => {
            res.send(data);
            console.log("Post 테이블의 모든 데이터를 성공적으로 조회했습니다.");
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving posts.",
            });
            console.log(
                err.message || "Some error occurred while retrieving posts."
            );
        });
};

