const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

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
    res.json({ message: "Hi~" });
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
