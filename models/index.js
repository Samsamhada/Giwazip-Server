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

db.workers = require("./worker.model.js")(sequelize, Sequelize);
db.rooms = require("./room.model.js")(sequelize, Sequelize);
db.statuses = require("./status.model.js")(sequelize, Sequelize);
db.posts = require("./post.model.js")(sequelize, Sequelize);
db.photos = require("./photo.model.js")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db["workers"].hasMany(db["rooms"], { foreignKey: "workerID" });
db["rooms"].belongsTo(db["workers"], { foreignKey: "workerID" });

db["rooms"].hasMany(db["statuses"], { foreignKey: "roomID" });
db["statuses"].belongsTo(db["rooms"], { foreignKey: "roomID" });

db["rooms"].hasMany(db["posts"], { foreignKey: "roomID" });
db["posts"].belongsTo(db["rooms"], { foreignKey: "roomID" });

db["posts"].hasMany(db["photos"], { foreignKey: "postID" });
db["photos"].belongsTo(db["posts"], { foreignKey: "postID" });

module.exports = db;
