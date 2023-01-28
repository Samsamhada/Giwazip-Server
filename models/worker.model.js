module.exports = (sequelize, Sequelize) => {
    const Worker = sequelize.define(
        "worker",
        {
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "user_id",
                primaryKey: true,
            },
            // workerID: {
            //     type: Sequelize.INTEGER,
            //     allowNull: false,
            //     field: "worker_id",
            //     primaryKey: true,
            //     autoIncrement: true,
            // },
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
            // number: {
            //     type: Sequelize.STRING,
            //     field: "number",
            // },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "worker",
        }
    );

    // Worker.associate = (models) => {
    //     Worker.hasMany(models.Room, {
    //         foreignKey: "workerID",
    //         sourceKey: "workerID",
    //     });
    // };

    return Worker;
};
