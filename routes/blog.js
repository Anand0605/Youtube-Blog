// const { Router } = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const mongoose = require("mongoose");
// const Blog = require("../models/blog");
// const Comment = require("../models/comment");

// const router = Router();

// // ✅ Ensure upload directory exists
// const uploadDir = path.resolve("./public/uploads");
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // ✅ Multer Configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, uploadDir),
//     filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });
// const upload = multer({ storage });

// // ✅ Middleware: Ensure user is logged in
// const ensureAuthenticated = (req, res, next) => {
//     if (!req.user) {
//         return res.redirect("/user/signin");
//     }
//     next();
// };

// // 📝 GET: Show Add Blog Form
// router.get("/add-new", ensureAuthenticated, (req, res) => {
//     res.render("addBlog", { user: req.user });
// });

// // 📝 GET: Show Single Blog Page with Comments
// router.get("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).send("Invalid Blog ID");
//         }

//         const blogDetail = await Blog.findById(id)
//             .populate("createdBy")
//             .populate({
//                 path: "comments",
//                 populate: { path: "user", select: "username" }
//             });

//         if (!blogDetail) return res.status(404).send("Blog not found");

//         res.render("blogDetail", { blogDetail, user: req.user || null });
//     } catch (error) {
//         console.error("Error fetching blog:", error); // ✅ Log error details
//         res.status(500).send("Internal Server Error");
//     }
// });


// // 📝 POST: Add a Comment to Blog
// router.post("/comment/:blogId", ensureAuthenticated, async (req, res) => {
//     try {
//         const { blogId } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(blogId)) {
//             return res.status(400).send("Invalid Blog ID");
//         }

//         const comment = await Comment.create({
//             content: req.body.content,
//             blogId,
//             user: req.user._id
//         });

//         // ✅ Add comment to blog
//         await Blog.findByIdAndUpdate(blogId, { $push: { comments: comment._id } });

//         return res.redirect(`/blog/${blogId}`);
//     } catch (error) {
//         console.error("Error adding comment:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// // 📝 POST: Create New Blog (Requires Login)
// router.post("/", ensureAuthenticated, upload.single("coverImage"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send("File upload failed!");
//         }

//         const { title, body } = req.body;
//         const blog = await Blog.create({
//             title,
//             body,
//             createdBy: req.user._id,
//             coverImageUrl: `/uploads/${req.file.filename}`
//         });
//         res.redirect(`/blog/${blog._id}`);
//     } catch (error) {
//         console.error("Error creating blog:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// module.exports = router;


const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

// ✅ Ensure upload directory exists
const uploadDir = path.resolve("./public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// ✅ Middleware: Ensure user is logged in
const ensureAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/user/signin");
    }
    next();
};

// 📝 GET: Show Add Blog Form
router.get("/add-new", ensureAuthenticated, (req, res) => {
    res.render("addBlog", { user: req.user });
});

// 📝 GET: Show Single Blog Page with Comments
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Blog ID");
        }

        const blogDetail = await Blog.findById(id)
            .populate("createdBy")
            .populate({
                path: "comments",
                populate: { path: "user", select: "username" }
            });

        if (!blogDetail) return res.status(404).send("Blog not found");

        res.render("blogDetail", { blogDetail, user: req.user || null });
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 📝 POST: Add a Comment to Blog
router.post("/blogDetail/comment/:blogId", ensureAuthenticated, async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).send("Invalid Blog ID");
        }

        const comment = await Comment.create({
            content: req.body.content,
            blogId,
            user: req.user._id
        });

        // ✅ Add comment to blog
        await Blog.findByIdAndUpdate(blogId, { $push: { comments: comment._id } });

        // ✅ Console me comment print hoga
        console.log(`New Comment Added by ${req.user.username}: "${req.body.content}"`);

        return res.redirect(`/blog/${blogId}`);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 📝 POST: Create New Blog (Requires Login)
router.post("/", ensureAuthenticated, upload.single("coverImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File upload failed!");
        }

        const { title, body } = req.body;
        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageUrl: `/uploads/${req.file.filename}`
        });

        res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

