const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { findById } = require("../models/itemModel");

// checks if inputs are empty
const errorCheck = ({ username, password }) => {
  if (username === "" || password === "") return false;
  return true;
};

// GET user
// grabs a user
const getUser = asyncHandler(async (req, res) => {
  const user = await User.find(
    { username: req.body.username },
    { password: 0 },
  );
  res.send(user);
});

// searches for specific user
const searchUser = asyncHandler(async (req, res) => {
  const user = await User.find({ username: req.body.search }, { password: 0 });
  if (!user[0] || user[0].username === "admin")
    return res.status(404).send({ message: "Cannot find user" });
  else res.send(user);
});

// POST user
// creates new user
const createUser = asyncHandler(async (req, res) => {
  if (!errorCheck(req.body)) {
    return res.status(409).send({ message: "Please fill in all inputs" });
  }
  if (req.username > 30) {
    return res.status(409).send({ message: "Username is too long" });
  }
  const users = await User.find();
  let checkingUsers = _.findIndex(users, (item) => {
    return item.username === req.body.username;
  });
  if (checkingUsers !== -1) {
    return res.status(403).send({ message: "User already exists" });
  }
  let newUser = new User(req.body);
  await newUser.save();
  res.send({ message: "You have successfully signed up!" });
});

// PUT
// make changes to the users permission
const editPermission = asyncHandler(async (req, res) => {
  let boolean;
  const id = req.body.id;
  if (req.body.permission === false) boolean = true;
  else if (req.body.permission === true) boolean = false;
  if (id === "63fd25df36abdca87cb18907")
    return res.status(403).send({ message: "Cannot edit admin permission" });
  await User.findByIdAndUpdate(id, { permission: boolean });
  const user = await User.findById({ _id: id });

  res.send(user);
});

// checking if login is successful if so makes a jwt token
const validate = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!errorCheck(req.body)) {
    return res.status(409).send({ message: "Please fill in all inputs" });
  }

  const users = await User.find();
  const userToValidate = { username: null, password: null };
  for (let data of users) {
    if (data.username === username) {
      userToValidate.username = data.username;
      userToValidate.password = data.password;
      break;
    }
  }

  if (
    username === userToValidate.username &&
    password === userToValidate.password
  ) {
    payload = { username };
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    res.json(token);
  } else {
    res.status(403).send({
      message: "Login failed. Check your email and password is correct",
    });
  }
});

module.exports = {
  validate,
  getUser,
  createUser,
  editPermission,
  searchUser,
};
