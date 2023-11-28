import mongoose from "mongoose";

const PictureSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserColl", required: true },
    picture: { type: String },
});

const ProfilePicture = mongoose.model("PictureColl", PictureSchema);

export default ProfilePicture;