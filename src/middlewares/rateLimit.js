const rateLimit = require("express-rate-limit")

const allowList = ["::1"]
 
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: (req,res) => {
        if(req.url === '/login' || req.url === '/register') {return 5} 
        else {return 100}
    },
    message: {
        success: false,
        message: "Fazla denediniz"
    },
    skip:(req,res) => allowList.includes(req.ip),
    standardHeaders: 'draft-7',
    legacyHeaders: false
    
})

module.exports = apiLimiter