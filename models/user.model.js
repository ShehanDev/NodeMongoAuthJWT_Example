import mongoose from "mongoose";

const User = mongoose.model(
  "User",
  mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

export default User;
