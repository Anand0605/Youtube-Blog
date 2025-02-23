const path = require('path')
const express  = require('express')
const mongoose = require('mongoose')
const userRoute = require("./routes/user")

const app = express();
const PORT = 8000;
mongoose.connect('mongodb://localhost:27017/Blogify').then((e)=>console.log("mongodb connected"))

app.set("view engine","ejs")
app.set("views",path.resolve('./views'))

app.use(express.urlencoded({ extended: true })); // Form data ke liye
app.use(express.json()); // JSON body parse karne ke liye

app.get('/',(req, res)=>{
    res.render('home')
})
app.use("/user",userRoute)

app.listen(PORT,()=>console.log(`server started at port ${PORT}`))