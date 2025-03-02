// const { Schema, model } = require("mongoose");

// const blogSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     body: {
//         type: String,
//         required: true
//     },
//     coverImageUrl: {
//         type: String,
//         required: false
//     },
//     createdBy:{
//         type:Schema.Types.ObjectId,
//         ref:"user"
//     }
// },{timestamps:true})

// const Blog = model("blog",blogSchema)

// module.exports = Blog;

const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // ✅ Ensure correct reference (uppercase "User")
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", // ✅ Correct reference to Comment model
      },
    ],
  },
  { timestamps: true }
);

const Blog = model("Blog", blogSchema);

module.exports = Blog;


