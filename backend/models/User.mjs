// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  email: { type: String, required: true },
  password: { type: String, required: true },
  monthly_income: { type: Number },
  picture: { type: String },
  join_id: { type: String, default: null }, 
}
, {
  collation: { locale: 'en', strength: 2 }
}
);

const User = mongoose.model("UserColl", userSchema);

export default User;
