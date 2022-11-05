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
    console.log("worker.model.js Worker: " + Worker);
    console.log("worker.model.js Worker.workerID: " + Worker.workerID);
    console.log(
        "worker.model.js Worker === sequelize.models.worker: " +
            (Worker === sequelize.models.worker)
    );
    return Worker;
};
