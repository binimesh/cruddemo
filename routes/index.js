const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("./helpers/db");
const userRoute = require("./user");
const authRoute = require("./auth");
const productRoute = require("./product");
const cartRoute = require("./cart");
const orderRoute = require("./order");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
