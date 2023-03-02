const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 5000;

const bodyParser = require("body-parser");

// itemsController functions
const {
  getProducts,
  addProduct,
  deleteProduct,
  editProduct,
} = require("./controllers/itemsController");

// middleware functions
const { checkJWTToken, adminCheck } = require("./middleware");
// userController functions
const {
  createUser,
  validate,
  getUser,
  editPermission,
  searchUser,
} = require("./controllers/userController");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.set("strictQuery", false);

// routes
app.get("/items", checkJWTToken, getProducts);
app.get("/auth", checkJWTToken, getUser);
app.post("/add-product", checkJWTToken, addProduct);
app.post("/sign-up", createUser);
app.post("/login", validate);
app.delete("/items", checkJWTToken, deleteProduct);
app.put("/edit-product", checkJWTToken, editProduct);

// Admin routes
app.post("/search", adminCheck, searchUser);
app.put("/search", adminCheck, editPermission);

// shows if wrong url is entered
app.get("/*", (req, res) => {
  res.statusCode = 404;
  res.send({ error: "Sorry! Can’t find that resource. Please check your URL" });
});
// connecting to mongo db
const startServer = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URI}`);
    // starting port
    app.listen(port, () => {
      console.log(`listening on port ${port}!`);
    });
  } catch {
    console.log("failed to start the server");
  }
};

startServer();
