import mongoose from "mongoose";

const UpcomingPaymentSchema = new mongoose.Schema({
  frequency: { type: String, required: true },
  category: { type: String },
  amount: { type: Number, required: true },
  start_date: { type: Date, default: Date.now },
  end_date: { type: Date, required: true },
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

UpcomingPaymentSchema.virtual("user", {
  ref: function (doc) {
    return doc.userType;
  },
  localField: "userRef",
  foreignField: "_id",
  justOne: true
});

const UpcomingPayment = mongoose.model("UpcomingPaymentColl", UpcomingPaymentSchema);

export default UpcomingPayment;
