const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/Blog");
const Blog = require("./models/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

// ✅ MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/Blogify", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// ✅ Middleware Setup
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// ✅ **IMPORTANT: Move this middleware BEFORE routes**
app.use((req, res, next) => {
  // console.log("🔹 Middleware: Current User:", req.user);  // ✅ Debugging
  res.locals.user = req.user || null;  
  next();
});

// ✅ Home Route
app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    // console.log("🏠 Home Route: User ->", req.user); // ✅ Debugging

    res.render("home", {
      user: req.user || null,
      blogs: allBlogs,
    });
  } catch (error) {
    // console.error("❌ Error Fetching Blogs:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);

// ✅ Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running at: http://localhost:${PORT}`)
);
