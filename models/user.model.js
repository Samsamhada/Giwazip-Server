module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        "User",
        {
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "user_id",
                primaryKey: true,
                autoIncrement: true,
            },
            number: {
                type: Sequelize.STRING,
                field: "number",
                unique: true,
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
