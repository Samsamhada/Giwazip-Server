module.exports = (sequelize, Sequelize) => {
    const Worker = sequelize.define(
        "worker",
        {
            workerID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "worker_id",
                primaryKey: true,
                autoIncrement: true,
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
            number: {
                type: Sequelize.STRING,
                field: "number",
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
