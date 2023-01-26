module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define(
        "post",
        {
            postID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "post_id",
                primaryKey: true,
                autoIncrement: true,
            },
            roomID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "room_id",
            },
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "user_id",
            },
            categoryID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "category_id",
            },
            type: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "type",
            },
            description: {
                type: Sequelize.STRING,
                defaultValue: "",
                allowNull: false,
                field: "description",
            },
            createDate: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
                field: "create_date",
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "post",
        }
    );

    // Post.associate = (models) => {
    //     Post.belongsTo(models.Room, {
    //         foreignKey: "roomID",
    //         sourceKey: "roomID",
    //     });
    //     Post.hasMany(models.Photo, {
    //         foreignKey: "postID",
    //         sourceKey: "postID",
    //     });
    // };

    return Post;
};
