const {User} = require("../models/index")

class userCtrl {
    static async register(req,res,next){
        try {
            const user = await User.create(req.body)
            res.status(201).json({id: user.id, email:user.email})
        } catch (error) {
            
        }
    }
}

module.exports = {userCtrl}