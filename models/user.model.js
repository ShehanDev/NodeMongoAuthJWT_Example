import mongoose from "mongoose";

const User = mongoose.model(
  "User",
  mongoose.Schema({
    userName: String,
    email: String,
    role: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

export default User;
