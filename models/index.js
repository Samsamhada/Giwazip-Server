const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.workers = require("./worker.model.js")(sequelize, Sequelize);
db.rooms = require("./room.model.js")(sequelize, Sequelize);
db.userrooms = require("./userroom.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.posts = require("./post.model.js")(sequelize, Sequelize);
db.photos = require("./photo.model.js")(sequelize, Sequelize);

db.admins = require("./admin.model.js")(sequelize, Sequelize);
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db["users"].hasOne(db["workers"], { as: "worker", foreignKey: "userID" });
db["workers"].belongsTo(db["users"], { as: "user", foreignKey: "userID" });

db["users"].hasMany(db["userrooms"], { as: "userrooms", foreignKey: "userID" });
db["userrooms"].belongsTo(db["users"], { as: "user", foreignKey: "userID" });

db["rooms"].hasMany(db["userrooms"], { as: "userrooms", foreignKey: "roomID" });
db["userrooms"].belongsTo(db["rooms"], { as: "room", foreignKey: "roomID" });

db["rooms"].hasMany(db["categories"], {
    as: "categories",
    foreignKey: "roomID",
});
db["categories"].belongsTo(db["rooms"], { as: "room", foreignKey: "roomID" });

db["categories"].hasMany(db["posts"], {
    as: "posts",
    foreignKey: "categoryID",
});
db["posts"].belongsTo(db["categories"], {
    as: "category",
    foreignKey: "categoryID",
});

db["users"].hasMany(db["posts"], { as: "posts", foreignKey: "userID" });
db["posts"].belongsTo(db["users"], { as: "user", foreignKey: "userID" });

db["rooms"].hasMany(db["posts"], { as: "posts", foreignKey: "roomID" });
db["posts"].belongsTo(db["rooms"], { as: "room", foreignKey: "roomID" });

db["posts"].hasMany(db["photos"], { as: "photos", foreignKey: "postID" });
db["photos"].belongsTo(db["posts"], { as: "post", foreignKey: "postID" });

module.exports = db;
