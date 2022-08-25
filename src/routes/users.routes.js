const router = require("express").Router();
const bcrypt = require("bcrypt");

const userController = require("../controllers/users.controller");

router.get("/:id?", async (req, res) => {
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
});

router.post("/", async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        birthDate: req.body.birthDate,
        favouriteLanguaje: req.body.favouriteLanguaje,
        password: bcrypt.hashSync( req.body.password, 10 ),
    }

    if (!user.name || !user.email || !user.password || !user.birthDate) {
        return res.status(400).json({
            error: "Faltan datos"
        });
    }
    
    const exists = await userController.getByEmail(user.email);
    if(exists[0]){
        return res.status(400).json({
            error: "Email en uso"
        });
    }

    const saved = await userController.save(user)
    if (saved[0]) {
        return res.send({
            user: user,
            msg: "Registro correcto"
        });
    }

    return res.status(400).json({
        error: "Error al guardar el usuario"
    });
});

router.put("/:id", async (req, res) => {
    const bodyId = req.body.id;
    if ( bodyId && bodyId !== req.params.id) {
        return res.status(400).json({
            error: "Id no modificable"
        });
    }
    const { id } = req.params;
    const { name, email, birthDate, favouriteLanguaje, password } = req.body;
    const found = await userController.getById(id);
    if (!found[0]) {
        return res.status(404).json({
            error: "Usuario no encontrado",
        });
    }
    const user = {
        name: name || found[0].name,
        email: email || found[0].email,
        birthDate: birthDate || found[0].birthDate,
        favouriteLanguaje: favouriteLanguaje || found[0].favouriteLanguaje,
        password: password ? bcrypt.hashSync( password, 10 ) : found[0].password,
    }
    const updated = await userController.update(user)
    if (updated) {
        return res.send({
            user: user,
            msg: "Actualización correcta"
        });
    }

    return res.status(400).json({
        error: "Error al actualizar el usuario"
    });
});

router.delete("/:id", async (req, res) => {
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