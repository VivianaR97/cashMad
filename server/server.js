const express = require("express");
const app = express();
const path = require("path");

//Mi vista principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
})

//Ruta para recursos estáticos
app.use(express.static(path.join(__dirname, '../client')));

//Correr el servidor en el puerto 3000
app.listen(3000, err =>{
    if (err == undefined){
        console.log("Escuchando puerto 3000")
    } else {
        console.log(err);
    }
});


app.get('/login', (req, res) =>{
    console.log('here');
    res.sendFile(path.join(__dirname, '../client/vistas/login.html'));
});

app.post('/login', (req, res) =>{

    if (req.body.user && req.body.password != undefined){
        if(validarUsuario(req.body.user, req.body.password)){
            res.send('../client/vistas/home.html')
        }else{
            res.send(403);
        };
    }
})
