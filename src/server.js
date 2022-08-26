require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const verifyToken = require("./middlewares/auth.middlewares");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
//Rutas
app.use("/api/users", require("./routes/users.routes.js"));
app.use("/api/repositories", verifyToken, require("./routes/repositories.routes.js"));
app.use("/api/log-history", verifyToken, require("./routes/logHistory.routes.js"));
app.use("/", require("./routes/log.routes.js"));

app.use(function (req, res) {
    if (res.status(404)) {
        res.send({
            error: -2,
            descripcion: `ruta ${req.path} método ${req.method} no implementada`,
        });
    }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(
        `Server listening on ${PORT}`
    );
})
.on("error", (err) => {
    console.log(err);
});