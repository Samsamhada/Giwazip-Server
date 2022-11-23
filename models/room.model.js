module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define(
        "room",
        {
            roomID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "room_id",
                primaryKey: true,
                autoIncrement: true,
            },
            workerID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "worker_id",
            },
            clientName: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "client_name",
            },
            clientNumber: {
                type: Sequelize.STRING,
                field: "client_number",
            },
            startDate: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
                field: "start_date",
            },
            endDate: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
                field: "end_date",
            },
            warrantyTime: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "warranty_time",
            },
            inviteCode: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "invite_code",
                unique: true,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "room",
        }
    );

    // Room.associate = (models) => {
    //     Room.belongsTo(models.Worker, {
    //         foreignKey: "workerID",
    //         sourceKey: "workerID",
    //     });
    //     Room.hasMany(models.Status, {
    //         foreignKey: "roomID",
    //         sourceKey: "roomID",
    //     });
    //     Room.hasMany(models.Post, {
    //         foreignKey: "roomID",
    //         sourceKey: "roomID",
    //     });
    // };

    return Room;
};
