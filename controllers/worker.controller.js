const db = require("../models");
const Worker = db.workers;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
const moment = require("moment");
const chalk = require("chalk");

dotenv.config();

const apiKey = process.env.API_KEY;
