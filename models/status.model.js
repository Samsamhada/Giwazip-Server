module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define(
        "status",
        {
            statusID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "status_id",
                primaryKey: true,
                autoIncrement: true,
            },
            roomID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "room_id",
            },
            category: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "category",
            },
            status: {
                type: Sequelize.INTEGER,
                field: "status",
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "working_status",
        }
    );

    return Status;
};
