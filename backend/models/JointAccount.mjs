import mongoose from "mongoose";

const JASchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "UserColl", required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "UserColl", required: true },
}
);

const JA = mongoose.model("JAColl", JASchema);

export default JA;
