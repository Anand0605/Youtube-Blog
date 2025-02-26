const { Router } = require("express");
const User = require("../models/user")

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.get("/logout",(req, res)=>{
    res.clearCookie("token").redirect("/")
})

router.post("/signup", async (req, res) => {
    console.log("Request Body:", req.body); // Debugging ke liye

    const { fullname, email, password } = req.body;

    try {
        await User.create({
            fullname,
            email,
            password,
        });
        return res.redirect("/");
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send("Internal Server Error");
    }
});
// router.post("/signin", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const { user, token } = await User.matchPasswordAndGenerateToken(email, password);

//         if (!user) {
//             return res.status(401).render("signin", { error: "Invalid email or password" });
//         }

//         console.log("Token:", token);
//         console.log("User logged in:", user);

//         return res.render("home", { user, error: null }); // ✅ Error variable pass karein
//     } catch (error) {
//         console.error("Signin error:", error.message);
//         return res.status(401).render("signin", { error: "Incorrect password or user not found" });
//     }
// });

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await User.matchPasswordAndGenerateToken(email, password);

        if (!user) {
            return res.status(401).render("signin", { error: "Invalid email or password" });
        }

        console.log("Token:", token);
        console.log("User logged in:", user);

        // ✅ Cookie Set Karo
        res.cookie("token", token, {
            httpOnly: true,   // ✅ Security ke liye
            secure: false,    // ❌ Dev Mode me `false`, Production me `true`
            maxAge: 3600000,  // ✅ 1 Hour ke liye token valid rahega
        });

        return res.redirect("/");  // ✅ Redirect to home after login
    } catch (error) {
        console.error("Signin error:", error.message);
        return res.status(401).render("signin", { error: "Incorrect password or user not found" });
    }
});








module.exports = router;