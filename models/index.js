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

// db.workers = require("./worker.model.js")(sequelize, Sequelize);
// db.rooms = require("./room.model.js")(sequelize, Sequelize);
// db.statuses = require("./status.model.js")(sequelize, Sequelize);
// db.posts = require("./post.model.js")(sequelize, Sequelize);
// db.photos = require("./photo.model.js")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db["users"].hasOne(db["workers"], { foreignKey: "userID" });
db["workers"].belongsTo(db["users"], { foreignKey: "userID" });

db["users"].hasMany(db["userrooms"], { foreignKey: "userID" });
db["userrooms"].belongsTo(db["users"], { foreignKey: "userID" });

db["rooms"].hasMany(db["userrooms"], { foreignKey: "roomID" });
db["userrooms"].belongsTo(db["rooms"], { foreignKey: "roomID" });

db["rooms"].hasMany(db["categories"], { foreignKey: "roomID" });
db["categories"].belongsTo(db["rooms"], { foreignKey: "roomID" });

db["categories"].hasMany(db["posts"], { foreignKey: "categoryID" });
db["posts"].belongsTo(db["categories"], { foreignKey: "categoryID" });

db["users"].hasMany(db["posts"], { foreignKey: "userID" });
db["posts"].belongsTo(db["users"], { foreignKey: "userID" });

db["rooms"].hasMany(db["posts"], { foreignKey: "roomID" });
db["posts"].belongsTo(db["rooms"], { foreignKey: "roomID" });

db["posts"].hasMany(db["photos"], { foreignKey: "postID" });
db["photos"].belongsTo(db["posts"], { foreignKey: "postID" });

// db["workers"].hasMany(db["rooms"], { foreignKey: "workerID" });
// db["rooms"].belongsTo(db["workers"], { foreignKey: "workerID" });

// db["rooms"].hasMany(db["statuses"], { foreignKey: "roomID" });
// db["statuses"].belongsTo(db["rooms"], { foreignKey: "roomID" });

// db["rooms"].hasMany(db["posts"], { foreignKey: "roomID" });
// db["posts"].belongsTo(db["rooms"], { foreignKey: "roomID" });

// db["posts"].hasMany(db["photos"], { foreignKey: "postID" });
// db["photos"].belongsTo(db["posts"], { foreignKey: "postID" });

module.exports = db;
