const express = require("express");
require('dotenv').config()
const http = require("http");
const morgan = require("morgan");

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
//Rutas
app.use("/api/users", require("./routes/users.routes.js"));
// app.use("/api/repositories", require("./routes/repositories.routes.js"));
// app.use("/api/login-history", require("./routes/loginHistory.routes.js"));
app.use("/login", require("./routes/login.routes.js"));

app.use(function (req, res) {
    if (res.status(404)) {
        res.send({
            error: -2,
            descripcion: `ruta ${req.path} método ${req.method} no implementada`,
        });
    }
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
    console.log(
        `Server listening on ${PORT}`
    );
})
.on("error", (err) => {
    console.log(err);
});

