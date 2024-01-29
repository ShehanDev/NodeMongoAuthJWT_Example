import db from "../models/index.js";
//verify the user signUp
const ROLES = db.ROLES;
const User = db.user;

export const checkDuplicationUserNameOrEmail = async (req, res, next) => {
  try {
    const usernameUser = await User.findOne({
      username: req.body.username,
    }).exec();
    if (usernameUser) {
      return res
        .status(400)
        .send({ message: "Failed! Username is already in use!" });
    }

    // Check if email already exists
    const emailUser = await User.findOne({ email: req.body.email }).exec();
    if (emailUser) {
      return res
        .status(400)
        .send({ message: "Failed! Email is already in use!" });
    }
    // If both username and email are unique, proceed to the next middleware
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ message: error.message || "Internal Server Error" });
  }
};

// Middleware to check if roles provided in the request exist
export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (const role of req.body.roles) {
      if (!ROLES.includes(role)) {
        return res
          .status(400)
          .send({ message: `Failed! Role ${role} does not exist!` });
      }
    }
  }

  // If all roles exist, proceed to the next middleware
  next();
};
