module.exports = (sequelize, Sequelize) => {
    const Notice = sequelize.define(
        "Notice",
        {
            noticeID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "notice_id",
                primaryKey: true,
                autoIncrement: true,
            },
            adminID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "admin_id",
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "title",
            },
            content: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "content",
            },
            createDate: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
                field: "create_date",
            },
            isHidden: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: "is_hidden",
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "notice",
        }
    );

    return Notice;
};
