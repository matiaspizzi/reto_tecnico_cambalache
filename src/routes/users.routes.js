const router = require("express").Router();
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/auth.middlewares");

const userController = require("../controllers/users.controller");
const logHistoryController = require("../controllers/logHistory.controller");

router
    .get("/:id?", verifyToken, async (req, res) => {
        const { id } = req.params;
        if (id) {
            const found = await userController.getById(id);
            if (!found[0]) {
                return res.status(404).json({
                    error: "Usuario no encontrado",
                });
            }
            res.send(found[0]);
        } else {
            const all = await userController.getAll();
            res.send(all);
        }
    })

    .post("/", async (req, res) => {
        if (!req.body.name || !req.body.email || !req.body.password || !req.body.birth_date) {
            return res.status(400).json({
                error: "Faltan datos"
            });
        }
        const user = {
            name: req.body.name,
            email: req.body.email,
            birth_date: req.body.birth_date,
            favourite_language: req.body.favourite_language,
            password: bcrypt.hashSync(req.body.password, 10)
        }
        const exists = await userController.getByEmail(user.email);
        if (exists[0]) {
            return res.status(400).json({
                error: "Email en uso"
            });
        }
        const saved = await userController.save(user)
        if (saved[0]) {
            await logHistoryController.save({
                date_time: new Date(),
                type: "3",
                user_id: saved[0]
            })
            return res.send({
                user: user,
                msg: "Registro correcto"
            });
        }
        return res.status(400).json({
            error: "Error al guardar el usuario"
        });
    })

    .put("/:id", verifyToken, async (req, res) => {
        if (req.body.id && req.body.id !== req.params.id) {
            return res.status(400).json({
                error: "Id no modificable"
            });
        }
        const { id } = req.params;
        const { name, email, birth_date, favourite_language, password } = req.body;
        const found = await userController.getById(id);
        if (!found[0]) {
            return res.status(404).json({
                error: "Usuario no encontrado",
            });
        }
        if(email){
            const emailFound = await userController.getByEmail(email);
            if (emailFound[0]) {
                return res.status(404).json({
                    error: "Email en uso",
                });
            }
        }
        const user = {
            name: name || found[0].name,
            email: email || found[0].email,
            birth_date: birth_date || found[0].birth_date,
            favourite_language: favourite_language || found[0].favourite_language,
            password: password ? bcrypt.hashSync(password, 10) : found[0].password,
        }
        const updated = await userController.update(user, id)
        if (updated) {
            return res.send({
                user: user,
                msg: "Actualización correcta"
            });
        }
        return res.status(400).json({
            error: "Error al actualizar el usuario"
        });
    })

    .delete("/:id", verifyToken, async (req, res) => {
        const { id } = req.params;
        const found = await userController.getById(id);
        if (!found[0]) {
            return res.status(404).json({
                error: "Usuario no encontrado",
            });
        }
        const deleted = await userController.deleteById(id);
        if (deleted) {
            return res.send({
                msg: "Usuario eliminado"
            });
        }
    });

module.exports = router;