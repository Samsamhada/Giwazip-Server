module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define(
        "Admin",
        {
            adminID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: "admin_id",
                primaryKey: true,
                autoIncrement: true,
            },
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "id",
            },
            pw: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "pw",
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                field: "name",
            },
            allowChanging: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: "allow_changing",
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "admin",
        }
    );

    return Admin;
};
