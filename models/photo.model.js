module.exports = (sequelize, Sequelize) => {
    const Photo = sequelize.define(
        "photo",
        {
            photoID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "photo_id",
                primaryKey: true,
                autoIncrement: true,
            },
            postID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "post_id",
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "url",
            },
            // photoPath: {
            //     type: Sequelize.STRING,
            //     allowNull: false,
            //     field: "photo_path",
            // },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "photo",
        }
    );

    // Photo.associate = (models) => {
    //     Photo.belongsTo(models.Post, {
    //         foreignKey: "postID",
    //         sourceKey: "postID",
    //     });
    // };

    return Photo;
};
