import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  content: { type: String, required: true },
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

notificationSchema.virtual("user", {
  ref: function (doc) {
    return doc.userType;
  },
  localField: "userRef",
  foreignField: "_id",
  justOne: true
});

const Notification = mongoose.model("NotificationColl", notificationSchema);

export default Notification;
