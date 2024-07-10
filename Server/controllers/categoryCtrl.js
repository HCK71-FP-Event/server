const { Category } = require("../models/index")

class categoryCtrl {
    static async getCategory(req, res, next) {
        try {
            const categories = await Category.findAll()

            console.log(categories);

            res.status(200).json(categories)
        } catch (error) {
            next(error)
        }
    }
    
    static async postCategory(req,res,next) {
        try {
            const { name } = req.body
            if(!name) throw {name: "Category Name Empty"}
            const categories = await Category.create({
                name
            })
            res.status(201).json(categories)
            
        } catch (error) {
            next(error)
            
        }
    }
}

module.exports = {categoryCtrl}