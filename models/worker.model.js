module.exports = (sequelize, Sequelize) => {
    const Worker = sequelize.define(
        "Worker",
        {
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "user_id",
                primaryKey: true,
            },
            userIdentifier: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "user_identifier",
                unique: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "name",
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "email",
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "worker",
        }
    );

    return Worker;
};
