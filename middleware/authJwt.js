import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";
const Role = db.role;
const User = db.user;

// Middleware to verify the JWT token
export const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

// Middleware to check if the user has admin role
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    const isAdmin = roles.some((role) => role.name === "admin");

    if (isAdmin) {
      next();
    } else {
      res.status(403).send({ message: "Require Admin Role!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Middleware to check if the user has moderator role
export const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    const isModerator = roles.some((role) => role.name === "moderator");

    if (isModerator) {
      next();
    } else {
      res.status(403).send({ message: "Require Moderator Role!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
