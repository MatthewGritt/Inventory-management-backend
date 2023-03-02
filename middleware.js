const jwt = require("jsonwebtoken");

// checking for incorrect inputs
const checkForErrors = (obj) => {
  for (let item in obj) {
    if (obj[item] === "" || isNaN(obj.price) || isNaN(obj.quantity))
      return false;
  }
  if (obj.quantity > 10000 || obj.price > 10000) return false;
  const testQuantity = obj.quantity.toString().split("");
  if (testQuantity.includes(".")) return false;
  const testPrice = obj.price.toString().split("");
  if (testPrice.includes(".")) {
    const index = testPrice.indexOf(".");
    const slice = testPrice.slice(index);
    if (slice.length > 3) return false;
  }
  return true;
};

// checks if token is valid
function checkJWTToken(req, res, next) {
  if (req.headers.token) {
    let token = req.headers.token;
    jwt.verify(token, process.env.SECRET_KEY, function (error, data) {
      if (error) {
        res.status(403).send({ message: "Invalid Token" });
      } else {
        req.body.username = data.username;
        next();
      }
    });
  } else {
    return res
      .status(403)
      .json({ message: "No token attached to the request" });
  }
}

// checks if the user is admin
function adminCheck(req, res, next) {
  if (req.headers.token) {
    let token = req.headers.token;
    jwt.verify(token, process.env.SECRET_KEY, function (error, data) {
      if (error) {
        res.status(403).send({ message: "Invalid Token" });
      } else {
        if (data.username !== "admin") {
          res.status(403).send({ message: "Sorry only admin has access here" });
        } else next();
      }
    });
  } else {
    return res
      .status(403)
      .json({ message: "No token attached to the request" });
  }
}

module.exports = { checkJWTToken, checkForErrors, adminCheck };
