const router = require("express").Router();

const repositoriesController = require("../controllers/repositories.controller");

router
.get("/:id?", async (req, res) => {
    const { id } = req.params;
    if (id) {
        const found = await repositoriesController.getById(id);
        if (!found[0]) {
            return res.status(404).json({
                error: "Repositorio no encontrado",
            });
        }
        res.send(found[0]);
    } else {
        const all = await repositoriesController.getAll();
        res.send(all);
    }
})

.post("/", async (req, res) => {
    const repository = {
        projectName: req.body.projectName,
        languaje: req.body.languaje,
        createdAt: req.body.createdAt,
        description: req.body.description,
    }

    if (!repository.projectName || !repository.languaje || !repository.createdAt) {
        return res.status(400).json({
            error: "Faltan datos"
        });
    }

    // Verifica que el nombre del repositorio no tenga caracteres no deseados
    const stringTest = (str) => /^[a-z0-9-*~][a-z0-9-*._~][a-z0-9-~][a-z0-9-._~]*$/.test(str);
    if (!stringTest(repository.projectName)) {
        return res.status(400).json({
            error: "Nombre de proyecto no valido"
        });
    }
    
    const exists = await repositoriesController.getByName(repository.projectName);
    if(exists[0]){
        return res.status(400).json({
            error: "Nombre de repositorio no disponble"
        });
    }

    const saved = await repositoriesController.save(repository)
    if (saved[0]) {
        return res.send({
            repository: repository,
            msg: "Repositorio guardado"
        });
    }

    return res.status(400).json({
        error: "Error al guardar el repositorio"
    });
})

.put("/:id", async (req, res) => {
    const bodyId = req.body.id;
    if ( bodyId && bodyId !== req.params.id) {
        return res.status(400).json({
            error: "Id no modificable"
        });
    }
    const { id } = req.params;
    const { projectName, languaje, description } = req.body;
    const found = await repositoriesController.getById(id);
    if (!found[0]) {
        return res.status(404).json({
            error: "Repositorio no encontrado",
        });
    }
    const nameFound = await repositoriesController.getByName(projectName);
    if (nameFound[0]) {
        return res.status(404).json({
            error: "Nombre en uso",
        });
    }
    const repository = {
        projectName: projectName || found[0].projectName,
        languaje: languaje || found[0].languaje,
        description: description || found[0].description,
    }
    const updated = await repositoriesController.update(repository, id)
    if (updated) {
        return res.send({
            repository: repository,
            msg: "Actualización correcta"
        });
    }

    return res.status(400).json({
        error: "Error al actualizar el repositorio"
    });
})

.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const found = await repositoriesController.getById(id);
    if (!found[0]) {
        return res.status(404).json({
            error: "Repositorio no encontrado",
        });
    }
    const deleted = await repositoriesController.deleteById(id);
    if (deleted) {
        return res.send({
            msg: "Repositorio eliminado"
        });
    }
})

module.exports = router;