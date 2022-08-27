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
            return res.send(found[0]);
        } else {
            const all = await repositoriesController.getAll();
            return res.send(all);
        }
    })

    .post("/", async (req, res) => {
        const repository = {
            project_name: req.body.project_name,
            language: req.body.language,
            created_at: new Date(),
            description: req.body.description,
        }

        if (!repository.project_name || !repository.language || !repository.created_at) {
            return res.status(400).json({
                error: "Faltan datos"
            });
        }
        // Verifica que el nombre del repositorio no tenga caracteres no deseados
        const stringTest = (str) => /^[a-z0-9-*~][a-z0-9-*._~][a-z0-9-~][a-z0-9-._~]*$/.test(str);
        if (!stringTest(repository.project_name)) {
            return res.status(400).json({
                error: "Nombre de proyecto no valido"
            });
        }
        const exists = await repositoriesController.getByName(repository.project_name);
        if (exists[0]) {
            return res.status(400).json({
                error: "Nombre de repositorio no disponible"
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
        if (bodyId && bodyId !== req.params.id) {
            return res.status(400).json({
                error: "Id no modificable"
            });
        }
        const { id } = req.params;
        const { project_name, language, description } = req.body;
        const found = await repositoriesController.getById(id);
        if (!found[0]) {
            return res.status(404).json({
                error: "Repositorio no encontrado",
            });
        }
        if(project_name){
            const nameFound = await repositoriesController.getByName(project_name);
            if (nameFound[0]) {
                return res.status(404).json({
                    error: "Nombre en uso",
                });
            }
        }
        const repository = {
            project_name: project_name || found[0].project_name,
            language: language || found[0].language,
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