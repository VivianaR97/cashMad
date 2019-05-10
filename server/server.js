const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const expressSession = require('express-session');

//Conexión a la base de datos
const dbMongo = require('./dbMongo');

// Middleware de body-parser para json
app.use(bodyParser.json());

// Configuración de la librería express-session
app.use(expressSession({
    secret: 'Esta es una aplicacion para el proyecto final de ComunidadIT',
    resave: false,
    saveUninitialized: false
}));

//Ruta para recursos estáticos
app.use(express.static(path.join(__dirname, '../client')));

//GET "/"
app.get('/', (req, res) => {
    // Verifica que exista una sesión activa, de existir, redirige al home.
    if (req.session.userId != undefined) {
        res.redirect('/home');
        return;
    } else {
        //Responde index.html
        res.sendFile(path.join(__dirname, "../client/index.html"));
    }
})

//GET "/login"
app.get('/login', (req, res) => {
    // Verifica que exista una sesión activa, de existir, redirige al home.
    if (req.session.userId != undefined) {
        res.redirect('/home');
        return;
    }

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
        dbMongo.getUser(req.body.email, req.body.password,
            // Callback ok, 
            () => {
                // Establece el userId en mi objeto session
                req.session.userId = req.body.email;
                res.send('/home');
                res.end();
            },
            // Callback error
            () => {
                // Envía error y destruye cualquier sesión
                req.session.destroy();
                res.status(403).end();
            }
        );
    }
});


//POST '/crearUsuario'. Envía los datos a la base de datos, si el usuario no existe lo crea
app.post('/crearUsuario', (req, res) => {
    // Si no se recibió un usuario y contraseña, recarga la página de login
    if (req.body == undefined) {
        res.redirect("/login");
        return;
    } else {

        // Envía el usuario y contraseña ingresados para buscar coincidencias en la DB
        dbMongo.insertUser(req.body.user, req.body.email, req.body.password,
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

//GET 'home'
app.get('/home', (req, res) => {
    // Verifica que exista una sesión activa, de no existir, redirige al login
    if (req.session.userId == undefined) {
        res.redirect("/login");
        return;
    }
    res.sendFile(path.join(__dirname, '../client/vistas/home.html'));

});







/**
 *  ------------EN PROCESO---------------
 * 
 * Proceso de todo lo que debe mostrarse en la aplicación con el usuario en sesión
 * {$ACÁ VAN TODAS LAS FUNCIONES QUE SERÁN UTILIZADAS}
 * app.get ('/cargarMeta') 
 * 
 */ 


 /**
  * GET '/cargarMeta'. Busca la meta del usuario y la envía para ser mostrada.
  */
app.get('/cargarMeta', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login
    if (req.session.userId == undefined) {
        res.redirect("/login");
        return;
    } else {
        let email = req.session.userId;
        // Envía el usuario de la sesión para buscar coincidencias en la colección de metas
        dbMongo.getMeta(email,
            // Callback ok, 
            (arregloMeta) => {
                // Reenvío el archivo recibido
                console.log(arregloMeta);
                res.send();
                res.end();
            },
            // Callback error
            () => {
                // Envía error y destruye cualquier sesión
                req.session.destroy();
                res.status(403).end();
                res.redirect('/home');
            }
        );
    }
});








//Correr el servidor en el puerto 3000
app.listen(3000, err => {
    if (err == undefined) {
        console.log("Escuchando puerto 3000")
    } else {
        console.log(err);
    }
});