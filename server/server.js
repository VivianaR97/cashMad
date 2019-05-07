const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require("path");

//Los js propios
const login = require('./login');

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
app.listen(3000, err =>{
    if (err == undefined){
        console.log("Escuchando puerto 3000")
    } else {
        console.log(err);
    }
});

//GET "/login"
app.get('/login', (req, res) =>{
    //Responde login.html
    res.sendFile(path.join(__dirname, '../client/vistas/login.html'));
});



//POST "/login"
app.post('/login', (req, res) => {
    //Valida las credenciales del usuario
    if (req.body.user !== undefined && req.body.password !== undefined){
        //Si la validación es positiva responde home.html
        if(login.validarUsuario(req.body.user, req.body.password)){
            res.send('/home')
        }else{
            //Si la validación es negativa retorna error
            res.sendStatus(403);
        };
    //Si la validación es negativa responde error
    }else{
        res.sendStatus(404).end();
    }
})

app.get('/home', (req, res) =>{
    res.sendFile(path.join(__dirname, '../client/vistas/home.html'));
})