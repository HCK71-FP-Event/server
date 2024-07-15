const jsonwebtoken = require("jsonwebtoken");

const createToken = (payload) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
};

const verifyToken = (token) => {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET)
}

module.exports= {
    createToken,
    verifyToken
}