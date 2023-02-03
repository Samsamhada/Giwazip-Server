module.exports = (sequelize, Sequelize) => {
    const UserRoom = sequelize.define(
        "userroom",
        {
            userRoomID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "user_room_id",
                primaryKey: true,
                autoIncrement: true,
            },
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "user_id",
            },
            roomID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "room_id",
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "user_room",
        }
    );

    return UserRoom;
};
