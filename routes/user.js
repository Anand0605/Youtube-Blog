const { Router } = require("express");
const User = require("../models/user")

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

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
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Await lagao kyunki matchPassword ek async function hai
        const user = await User.matchPassword(email, password);

        if (!user) {
            return res.status(401).send("Invalid email or password");
        }

        console.log("User logged in:", user);
        return res.redirect("/");
    } catch (error) {
        console.error("Signin error:", error.message);
        return res.status(401).send("Incorrect password or user not found");
    }
});



module.exports = router;