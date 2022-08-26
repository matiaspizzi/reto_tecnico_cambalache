const jwt = require("jsonwebtoken");

const usersController = require('../controllers/users.controller')
const redisClient = require("../db/redis.config");

async function verifyToken(req, res, next) {
    const token = req.headers["auth_token"];
    if (!token) {
        return res.status(401).json({
            error: "Sesión expirada"
        });
    }
    jwt.verify(token, process.env.JWT_ACCESS_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                error: err
            });
        }
        const redisToken = await redisClient.get(decoded.id.toString());
        const user = await usersController.getById(decoded.id);
        if (!user) {
            return res.status(404).json({
                error: "No se encontró el usuario"
            });
        } else if (redisToken !== token) {
            return res.status(401).json({
                error: "Sesión expirada"
            });
        }
        next();
    });
}

module.exports = verifyToken