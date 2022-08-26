const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = require('../controllers/users.controller')
const logHistoryController = require('../controllers/logHistory.controller')

const redisClient = require("../db/redis.config");
const verifyToken = require("../middlewares/auth.middlewares");

router.post("/login", async (req, res) => {
    const user = await userController.getByEmail(req.body.email);
    if (!user[0]) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    const passwordCorrect = (user === null ? false : bcrypt.compareSync(req.body.password, user[0].password));
    if (!passwordCorrect) {
        return res.status(401).json({
            error: "Usuario o contraseña incorrectos"
        });
    }

    // Crea jwt
    const accessToken = jwt.sign({ id: user[0].id }, process.env.JWT_ACCESS_KEY, {
        expiresIn: process.env.JWT_TIME
    });
    await redisClient.set(user[0].id.toString(), accessToken);

    // Guardar log de inicio de sesión
    await logHistoryController.save({
        date_time: new Date(),
        type: "1",
        user_id: user[0].id
    });

    return res.send({
        accessToken,
        user: user[0]
    });
})

    .post("/logout", verifyToken, async (req, res) => {
        try {
            const token = req.headers["auth_token"];
            jwt.verify(token, process.env.JWT_ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        error: err
                    });
                }
                // Borra el token de redis
                await redisClient.del(decoded.id.toString());
                // Guarda log de cerrar sesión
                await logHistoryController.save({
                    date_time: new Date(),
                    type: "2",
                    user_id: decoded.id
                });

                return res.send({
                    id: decoded.id,
                    msg: "Logout correcto"
                });
            });
        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    })

    .post('/signup', function (_req, res) {
        return res.redirect(307, '/api/users');
    });

module.exports = router;
