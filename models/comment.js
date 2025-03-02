const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blog: {  // ✅ Use `blog` instead of `blogDetail`
      type: Schema.Types.ObjectId,
      ref: "Blog", // ✅ Correct Blog reference
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // ✅ Correct User reference
      required: true,
    },
  },
  { timestamps: true } // ✅ Automatically adds createdAt & updatedAt fields
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;


