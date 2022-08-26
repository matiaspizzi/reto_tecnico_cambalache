const router = require("express").Router();

const logHistoryController = require("../controllers/logHistory.controller");

router
.get('/:id?', async (req, res) => {
    if(req.params.id){
        const found = await logHistoryController.getById(req.params.id);
        if(!found[0]){
            return res.status(404).json({
                error: "Registro no encontrado"
            });
        }
        return res.send(found[0]);
    }
    const all = await logHistoryController.getAll();
    return res.send(all);
})

.get('/user/:id', async (req, res) => {
    if(req.params.id){
        const found = await logHistoryController.getByUserId(req.params.id);
        if(!found[0]){
            return res.status(404).json({
                error: "Historial no encontrado"
            });
        }
        return res.send(found);
    }
    return res.status(400).json({
        error: "Error al buscar el historial"
    });
})

.post('/', async (req, res) => {
    
    if(!req.body.date_time || !req.body.type || !req.body.user_id){
        return res.status(400).json({
            error: "Faltan datos"
        });
    }

    const log = {
        date_time: req.body.date_time,
        type: req.body.type,
        user_id: req.body.user_id
    }

    const saved = await logHistoryController.save(log)
    if(saved[0]){
        return res.send({
            log: log,
            msg: "Registro correcto"
        });
    }

    return res.status(400).json({
        error: "Error al guardar el registro"
    });
})

module.exports = router;