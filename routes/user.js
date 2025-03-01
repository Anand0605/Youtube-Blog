const { Router } = require("express");
const User = require("../models/user");

const router = Router();

// 📝 GET: Sign In Page
router.get("/signin", (req, res) => {
    return res.render("signin");
});

// 📝 GET: Sign Up Page
router.get("/signup", (req, res) => {
    return res.render("signup");
});

// 📝 GET: Logout User
router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
});


// 📝 POST: User Signup
router.post("/signup", async (req, res) => {
    // console.log("🔹 Signup Request Body:", req.body); // Debugging ke liye

    const { fullname, email, password } = req.body;

    try {
        const user = await User.create({ fullname, email, password });

        if (!user) {
            return res.status(400).send("User registration failed!");
        }

        // console.log("✅ User Created Successfully:", user);
        return res.redirect("/user/signin"); // ✅ Fix: Redirect to correct signin page
    } catch (error) {
        // console.error("❌ Error creating user:", error);
        return res.status(500).send("Internal Server Error");
    }
});


// 📝 POST: User Signin
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await User.matchPasswordAndGenerateToken(email, password);

        if (!user) {
            return res.status(401).render("signin", { error: "Invalid email or password" });
        }

        // console.log("🔹 Token Generated:", token); // ✅ Check if token is generated

        // ✅ Cookie Set Karo (5 Hours)
        res.cookie("token", token, {
            httpOnly: true,    
            secure: false,     // ❌ Dev Mode me `false`, Production me `true`
            maxAge: 5 * 60 * 60 * 1000,   
        });

        // console.log("✅ Cookie Set Successfully!");

        return res.redirect("/");  
    } catch (error) {
        // console.error("❌ Signin Error:", error.message);
        return res.status(401).render("signin", { error: "Incorrect password or user not found" });
    }
});


module.exports = router;
