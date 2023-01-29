const db = require("../models");
const Room = db.rooms;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const chalk = require("chalk");
const moment = require("moment");

dotenv.config();

const apiKey = process.env.API_KEY;
