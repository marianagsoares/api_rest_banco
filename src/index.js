const express = require('express');
const router = require('./routers/banco.router');
const app = express();

app.use(express.json());
app.use(router);

const port = 3000;
app.listen(port, () => {
    console.log("Servidor rodando");
});