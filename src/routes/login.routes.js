const router = require("express").Router();
const bcrypt = require("bcrypt");
const userController = require('../controllers/users.controller')

router.post("/", (req, res) => {
    const {body} = req;
    const {email, password} = body;
    const user = userController.getByEmail(email);
    const passwordCorrect = user === null ? false : bcrypt.compareSync(password, user.password);

    if (!passwordCorrect) {
        return res.status(401).json({
            error: "Usuario o contraseña incorrectos"
        });
    }

    res.send({
        user: user,
        msg: "Login correcto"
    });
});

module.exports = router;
