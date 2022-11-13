const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

var corsOptions = {
    origin: "https://localhost:3000",
};

app.use(cors(corsOptions));

app.use(express.json());

const db = require("./models");
db.sequelize
    .sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

app.get("/", (req, res) => {
    if (req.header("API-Key") == process.env.API_KEY) {
        res.json({ message: "Hi~" });
        console.log("Connection Success at /");
    } else {
        res.json({ message: "Connection Fail" });
        console.log("Connection Fail at /");
    }
});

require("./routes/worker.routes")(app);
require("./routes/room.routes")(app);
require("./routes/status.routes")(app);
require("./routes/post.routes")(app);
require("./routes/photo.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
