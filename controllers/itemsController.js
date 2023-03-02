// const _ = require("lodash");
const Item = require("../models/itemModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { checkForErrors } = require("../middleware");

// GET
// fetches all the products
const getProducts = asyncHandler(async (req, res) => {
  let items = await Item.find();
  if (!items) res.status(400).json({ message: "Could not fetch data" });
  items = items.reverse();
  res.send(items);
});

// POST
// add a new product
const addProduct = asyncHandler(async (req, res) => {
  if (!checkForErrors(req.body))
    return res.status(409).json({ message: "Incorrect input entered" });
  if (!req.body.permission)
    return res
      .status(404)
      .send({ message: "You do not have permission to make changes" });
  let itemModel = new Item(req.body);
  await itemModel.save();

  res.json({ message: "Product Added" });
});

// PUT
// edits a product
const editProduct = asyncHandler(async (req, res) => {
  if (!checkForErrors(req.body))
    return res.status(409).json({ message: "Incorrect input entered" });
  const { id, name, category, price, quantity, description } = req.body;
  if (!id) {
    res.status(404).json({ message: "Could not find id" });
  }
  if (!req.body.permission)
    return res
      .status(404)
      .send({ message: "You do not have permission to make changes" });
  await Item.findByIdAndUpdate(id, {
    name,
    category,
    quantity,
    price,
    description,
  });

  res.json({ message: "Edit successfull" });
});

// DELETE
// deletes a product
const deleteProduct = asyncHandler(async (req, res) => {
  const deleteId = req.body.id;
  if (!deleteId) {
    return res.status(409).json({ message: "Missing id" });
  }
  if (!req.body.permission)
    return res
      .status(404)
      .send({ message: "You do not have permission to make changes" });
  await Item.deleteOne({ _id: deleteId });
  let items = await Item.find();
  if (!items) res.status(400).json({ message: "Could not fetch data" });
  items = items.reverse();
  res.send(items);
});

module.exports = { getProducts, addProduct, editProduct, deleteProduct };
