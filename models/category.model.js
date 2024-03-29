module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define(
        "Category",
        {
            categoryID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "category_id",
                primaryKey: true,
                autoIncrement: true,
            },
            roomID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "room_id",
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "name",
            },
            progress: {
                type: (Sequelize.DECIMAL.types.postgres = ["numeric"]),
                defaultValue: 0,
                allowNull: false,
                field: "progress",
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "category",
        }
    );

    return Category;
};
