// const { Router } = require("express");
// const multer = require("multer");
// const path = require("path");
// const Blog = require("../models/blog");

// const router = Router();

// // ✅ Multer Configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve("./public/uploads")); // Images folder
//     },
//     filename: function (req, file, cb) {
//         const fileName = `${Date.now()}-${file.originalname}`;
//         cb(null, fileName);
//     }
// });

// const upload = multer({ storage: storage });

// // 📝 GET: Show Add Blog Form
// router.get('/add-new', (req, res) => {
//     return res.render('addBlog', { user: req.user });
// });

// router.get('/id', async (req, res) => {
//     const blog = await Blog.findById(req.params.id)
// })

// // 📝 POST: Create New Blog
// router.post('/', upload.single("coverImage"), async (req, res) => {
//     // console.log("Uploaded File:", req.file);  // Debugging ke liye

//     if (!req.file) {
//         return res.status(400).send("File upload failed!");
//     }

//     const { title, body } = req.body;
//     const blog = await Blog.create({
//         body,
//         title,
//         createdBy: req.user._id,
//         coverImageUrl: `/uploads/${req.file.filename}`
//     });

//     // console.log("Saved Blog:", blog); // ✅ Database me entry check karein

//     return res.redirect(`/blog/${blog._id}`);
// });


// // 📝 GET: Show Single Blog
// router.get("/:id", async (req, res) => {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).send("Blog not found");

//     res.render("blogDetail", { blog, user: req.user });
// });

// module.exports = router;

const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Blog = require("../models/blog");

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

// 📝 Middleware: Ensure user is logged in
const ensureAuthenticated = (req, res, next) => {
    if (!req.user) {  // ✅ Fix: `req.user` ko check karo instead of `req.isAuthenticated()`
        return res.redirect("/user/signin"); // ✅ Fix: Redirect to correct login page
    }
    next();
};

// 📝 GET: Show Add Blog Form
router.get("/add-new", ensureAuthenticated, (req, res) => {
    res.render("addBlog", { user: req.user });
});

// 📝 GET: Show Single Blog Page
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Blog ID");
        }

        // ✅ Find Blog & Populate `createdBy`
        const blog = await Blog.findById(id).populate("createdBy");
        if (!blog) return res.status(404).send("Blog not found");

        // ✅ Debugging: Check user & blog data
        console.log("📌 Blog Details:", blog);
        console.log("📌 Current User:", req.user);

        // ✅ Render Template
        res.render("blogDetail", { blog, user: req.user || null }); // Pass logged-in user
    } catch (error) {
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
        // console.error("Error creating blog:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
