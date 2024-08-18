const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const massacresRoutes = require("./routes/massacresRoutes");
const listsRoutes = require("./routes/listRoutes");
const childDataRoutes = require("./routes/childDataRoutes");
const sheetRoutes = require("./routes/sheetRoutes");
const messagePaypalRoutes = require("./routes/messagePaypal");
const notificationsRoutes = require("./routes/notificationRoutes");
const backgroundRoutes = require("./routes/backgroundRoutes");
const sgelRoutes = require("./routes/sgelRoutes");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");
//////////////////////////////

const app = express();
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/imgData", express.static(__dirname + "/imgData"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/postImages", express.static(__dirname + "/postImages"));
app.use("/messagePaypal", express.static(__dirname + "/messagePaypal"));
app.use("/backgroundImages", express.static(__dirname + "/backgroundImages"));

app.use(express.urlencoded({ extended: false }));
app.use("/users", userRoutes);

app.use("/massacres", massacresRoutes);
app.use("/lists", listsRoutes);
app.use("/childData", childDataRoutes);
app.use("/sheet", sheetRoutes);
app.use("/messagePaypal", messagePaypalRoutes);
app.use("/sgel", sgelRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/background", backgroundRoutes);
//////////////////////////////////////////
mongoose
  .connect(process.env.CONNECTION_DB)
  .then(() => console.log("connected to db"))
  .catch((err) => console.error(err));
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
