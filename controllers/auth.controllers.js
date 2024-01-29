import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../models/index.js";
const User = db.user;
const Role = db.role;

//sign up
export const signUp = async (req, res) => {
  try {
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    await user.save();
    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      //console.log(roles);

      user.role = roles.map((role) => role._id);
      //console.log(user.roles);
      await user.save();
    } else {
      const role = await Role.findOne({ name: "user" });

      user.role = [role._id];

      await user.save();
    }
    console.log(user);
    res.status(200).send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Internal Server Error" });
  }
};

// Controller function to handle user signin
export const signIn = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
      .populate("roles", "-__v")
      .exec();

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      expiresIn: 86400, // 24 hours
    });

    const authorities = user.roles.map(
      (role) => "ROLE_" + role.name.toUpperCase()
    );

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "Internal Server Error" });
  }
};
