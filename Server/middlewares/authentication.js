const { User } = require("../models/index")
const { verifyToken } = require("../helpers/jsonwebtoken")

const authentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization) throw { name: "Invalid Token" }

        const [type, token] = authorization.split(" ")

        if (type !== "Bearer" || !token) throw { name: "Invalid Token" }

        const { id } = verifyToken(token)

        const user = await User.findByPk(id)

        if (!user) throw { name: "Invalid Token" }

        req.user = {
            id: user.id, role: user.role
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { authentication }