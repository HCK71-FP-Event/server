const { Category } = require("../models/index")

class categoryCtrl {
    static async getCategory(req, res, next) {
        try {
            const categories = await Category.findAll()

            res.status(200).json(categories)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = { categoryCtrl }