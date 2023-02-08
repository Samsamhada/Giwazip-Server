module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define(
        "Room",
        {
            roomID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "room_id",
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "name",
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
                defaultValue: 12,
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

    return Room;
};
