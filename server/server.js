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
        res.redirect('/login');
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

// GET '/destroySession'
app.get('/destroySession', (req, res) => {
    req.session.destroy();
    res.send('/');
    return;
});

// POST '/crearUsuario'. Envía los datos a la base de datos, si el usuario no existe lo crea
app.post('/crearUsuario', (req, res) => {
    // Si no se recibió un usuario y contraseña, recarga la página de login
    if (req.body == undefined) {
        res.redirect('/login');
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
        res.redirect('/login');
        return;
    }
    res.sendFile(path.join(__dirname, '../client/vistas/home.html'));

});






// <----------------- FUNCIONALIDADES SOBRE METAS ----------------->
/**
 * GET '/cargarMeta'. Busca la meta del usuario y la envía para ser mostrada.
 */
app.get('/cargarMeta', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else {
        let email = req.session.userId;
        // Envía el usuario de la sesión para buscar coincidencias en la colección de metas
        dbMongo.getMeta(email,
            // Callback ok, 
            (arregloMeta) => {
                if (arregloMeta == false) {
                    // Si no existe meta, reenvío vacío
                    res.send('');
                    res.end();
                } else {
                    // Reenvío el archivo recibido
                    res.send(arregloMeta);
                    res.end();
                }
            },
            // Callback error
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
            }
        );
    }
});

/**
 * POST '/editarMeta'. Utiliza el email de la sesión y trae los campos de cliente para actualizar la meta.
 */
app.post('/editarMeta', (req, res) => {
    // Verifica que exista una sesión activa, de no existir, redirige al login
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else if (req.body == undefined) {
        res.redirect('/home');
    } else {
        let email = req.session.userId;
        dbMongo.editarMeta(email, req.body.nombreMeta, req.body.objetivoMeta, req.body.fechaMeta,
            // Callback ok. Meta guardada exitosamente
            () => {
                res.send()
                return;
            },
            // Callback error.
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
            }
        );
    }
});



// <----------------- FUNCIONALIDADES SOBRE INGRESOS ----------------->
/**
 * GET '/tablaIngresos'. Trae todos los campos para rellenar la tabla de ingresos del cliente en sesión
 */
app.get('/tablaIngresos', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else {
        let email = req.session.userId;
        // Envía el usuario de la sesión para buscar coincidencias en la colección de ingresos
        dbMongo.getIngresos(email,
            // Callback ok, 
            (arregloIngresos) => {
                res.send(arregloIngresos);
                res.end();
                return;
            },
            // Callback error
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
});

/**
 * GET '/graficaIngresos'. Trae los datos monto y fecha de los ingresos del usuario en sesión.
 */
app.get('/graficaIngresos', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else {
        let email = req.session.userId;
        // Envía el usuario de la sesión para buscar coincidencias en la colección de metas
        dbMongo.getGraficaIngresos(email,
            //Callback Ok.
            (arregloGraficaIngresos) => {
                res.send(arregloGraficaIngresos);
                res.end();
                return;
            },
            // Callback error
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        )
    }
})

/**
 * POST '/agregarIngreso'. Inserta un documento de ingreso para el usuario en sesión
 */
app.post('/agregarIngreso', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login.
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else if (req.body == undefined) {
        // Si no trae datos, recarga el home.
        res.redirect('/home');
    } else {
        let email = req.session.userId;
        dbMongo.insertIngreso(email, req.body.monto, req.body.descripcion, req.body.fecha,
            () => {
                res.send();
                return;
            },
            // Callback error.
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
});

/**
 * Trae los datos de un ingreso en particular, enviando su id.
 */
app.post('/getIngreso', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login.
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else if (req.body == undefined) {
        // Si no trae datos, recarga el home.
        res.redirect('/home');
    } else {
        dbMongo.getIngreso(req.body.id,
            (arrayIngreso) => {
                res.send(arrayIngreso);
                return;
            },
            // Callback error.
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
})

/**
 * Función que envía el id de un ingreso y sus campos a modificar.
 */
app.post('/editarIngreso', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login.
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else if (req.body == undefined) {
        // Si no trae datos, recarga el home.
        res.redirect('/home');
    } else {
        dbMongo.editarIngreso(req.body.id, req.body.monto, req.body.descripcion, req.body.fecha,
            () => {
                res.send();
                return;
            },
            // Callback error.
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
})

/**
 * Función que recibe un id y envía a DB para eliminar el documento correspondiente.
 */
app.post('/eliminarIngreso', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login.
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else if (req.body == undefined) {
        // Si no trae datos, recarga el home.
        res.redirect('/home');
    } else {
        dbMongo.eliminarIngreso(req.body.id,
            () => {
                res.send();
                return;
            },
            // Callback error.
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
})





// <----------------- FUNCIONALIDADES SOBRE EGRESOS ----------------->
/**
 * GET '/tablaEgresos'. Trae todos los campos para rellenar la tabla de egresos del cliente en sesión
 */
app.get('/tablaEgresos', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else {
        let email = req.session.userId;
        // Envía el usuario de la sesión para buscar coincidencias en la colección de egresos
        dbMongo.getEgresos(email,
            // Callback ok, 
            (arregloEgresos) => {
                res.send(arregloEgresos);
                res.end();
                return;
            },
            // Callback error
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
});

/**
 * GET '/graficaIngresos'. Trae los datos monto y fecha de los ingresos del usuario en sesión.
 */
app.get('/graficaEgresos', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else {
        let email = req.session.userId;
        // Envía el usuario de la sesión para buscar coincidencias en la colección de metas
        dbMongo.getGraficaEgresos(email,
            //Callback Ok.
            (arregloGraficaEgresos) => {
                res.send(arregloGraficaEgresos);
                res.end();
                return;
            },
            // Callback error
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        )
    }
})

/**
 * POST '/agregarIngreso'. Inserta un documento de ingreso para el usuario en sesión
 */
app.post('/agregarEgreso', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login.
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else if (req.body == undefined) {
        // Si no trae datos, recarga el home.
        res.redirect('/home');
    } else {
        let email = req.session.userId;
        dbMongo.insertEgreso(email, req.body.monto, req.body.categoria, req.body.fecha,
            () => {
                res.send();
                return;
            },
            // Callback error.
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
});

/**
 * Trae los datos de un ingreso en particular, enviando su id.
 */
app.post('/getEgreso', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login.
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else if (req.body == undefined) {
        // Si no trae datos, recarga el home.
        res.redirect('/home');
    } else {
        dbMongo.getEgreso(req.body.id,
            (arrayEgreso) => {
                res.send(arrayEgreso);
                return;
            },
            // Callback error.
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
})

/**
 * Función que envía el id de un egreso y sus campos a modificar.
 */
app.post('/editarEgreso', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login.
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else if (req.body == undefined) {
        // Si no trae datos, recarga el home.
        res.redirect('/home');
    } else {
        dbMongo.editarEgreso(req.body.id, req.body.monto, req.body.categoria, req.body.fecha,
            () => {
                res.send();
                return;
            },
            // Callback error.
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
})

/**
 * Función que recibe un id y envía a DB para eliminar el documento correspondiente.
 */
app.post('/eliminarEgreso', (req, res) => {
    // Si no existe usuario en la sesión, reenvía la página de login.
    if (req.session.userId == undefined) {
        res.redirect('/login');
        return;
    } else if (req.body == undefined) {
        // Si no trae datos, recarga el home.
        res.redirect('/home');
    } else {
        dbMongo.eliminarEgreso(req.body.id,
            () => {
                res.send();
                return;
            },
            // Callback error.
            () => {
                // Envía error.
                res.status(403).end();
                res.redirect('/home');
                return;
            }
        );
    }
})






//Correr el servidor en el puerto 3000
app.listen(3000, err => {
    if (err == undefined) {
        console.log("Escuchando puerto 3000")
    } else {
        console.log(err);
    }
});