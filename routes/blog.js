const { Router } = require("express");
const router = Router();

router.get('/add-new', (req, res) => {
    console.log(req.user);
    return res.render('addBlog',{
        
            user: req.user
    })
        
});

module.exports = router;