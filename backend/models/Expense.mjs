// models/expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  //user: { type: mongoose.Schema.Types.ObjectId, ref: "UserColl", required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  date: { type: Date, default: Date.now },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "userType"
  },
  userType: {
    type: String,
    required: true,
    enum: ["UserColl", "JA"]
  }
});

expenseSchema.virtual("user", {
  ref: function (doc) {
    return doc.userType;
  },
  localField: "userRef",
  foreignField: "_id",
  justOne: true
});

const Expense = mongoose.model("ExpenseColl", expenseSchema);

export default Expense;
