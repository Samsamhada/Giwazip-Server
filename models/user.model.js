module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        "user",
        {
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "user_id",
                primaryKey: true,
                autoIncrement: true,
            },
            isWorker: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false,
                field: "is_worker",
            },
            number: {
                type: Sequelize.STRING,
                field: "number",
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "user",
        }
    );

    return User;
};
