const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

//Conexión a la base de datos
const dbMongo = require('./dbMongo');

// Middleware de body-parser para json
app.use(bodyParser.json());

//Ruta para recursos estáticos
app.use(express.static(path.join(__dirname, '../client')));


//GET "/"
app.get("/", (req, res) => {
    //Responde index.html
    res.sendFile(path.join(__dirname, "../client/index.html"));
})

//Correr el servidor en el puerto 3000
app.listen(3000, err => {
    if (err == undefined) {
        console.log("Escuchando puerto 3000")
    } else {
        console.log(err);
    }
});

//GET "/login"
app.get('/login', (req, res) => {
    //Responde login.html
    res.sendFile(path.join(__dirname, '../client/vistas/login.html'));
});



//POST "/login"
app.post('/login', (req, res) => {
    // Si no se recibió un usuario y contraseña, recarga la página de login
    if (req.body == undefined) {
        res.redirect("/login");
        return;
    } else {

        // Envía el usuario y contraseña ingresados para buscar coincidencias en la DB
        dbMongo.getUser(req.body.user, req.body.password,
            // Callback ok, 
            () => {
                res.send('/home');
                res.end();
            },
            // Callback error
            errorMessage => {
                res.status(403);
                res.end();
            }
        );
    }
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/vistas/home.html'));
});