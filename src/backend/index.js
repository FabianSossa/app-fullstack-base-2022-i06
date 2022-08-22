//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

// get list devices of db table Devices
//==============[Peticion GET => Obtener información de los dispositivo] ============================
app.get('/devices/', function(req, res) {
    
    console.log("Get list devices!");
    utils.query('SELECT id, name, description, state, type from Devices',(err,rows) => {
        if(err){
            throw err;
            res.send(err).status(400);
            return
        }
        res.send(JSON.stringify(rows)).status(200);
    });
});
//==============[Peticion POST => Obtener información de un dispositivo] ============================
app.post('/getDevice/',function(req,res){
    console.log("Get device info");
    utils.query('SELECT id, name, description, state, type, \'getDevice_ok\' tipo from Devices where id = ?', req.body.idDevice, (err,rows) => {
        if(err){
            throw err;
            res.send(err).status(400);
            return
        }
        
        res.send(JSON.stringify(rows)).status(200);
    });
});
//==============[Peticion POST => Para actualizar los valores de un dispositivo] ============================
app.post('/updateDevice/', function(req,res){
    console.log("Update device");
    utils.query('update Devices set name = ?, description = ?, state = ?, type = ? where id = ?',
    [req.body.name, req.body.description, req.body.state, req.body.type, req.body.idDevice],(err,response) =>{
        if(err){
            throw err;
            res.send(err).status(400);
            return
        }
        response.tipo = 'update_ok';
        res.send(JSON.stringify(response)).status(200);
    });
});
//==============[Peticion POST => Agregar un nuevo ispositivo en la base de datos] ============================
app.post('/newDevice/', function(req,res){
    console.log("New register of Device.");
    utils.query('insert into Devices(name, description, state, type) values(?,?,?,?)',
    [req.body.name, req.body.description, req.body.state, req.body.type],(err,response) =>{
        if(err){
            throw err;
            res.send(err).status(400);
            return
        }
        response.tipo = 'add_ok';
        res.send(JSON.stringify(response)).status(200);
    });
});
//==============[Peticion POST => Para actualizar el valor de estado de un dispositivo] ============================
app.post('/updateStateDev/',function(req,res){
    console.log("Update device");
    //console.log([req.query.state, req.query.idDevice]);
    utils.query('update Devices set state = ? where id = ?',
    [req.body.state, req.body.idDevice],(err,response) =>{
        if(err){
            throw err;
            res.send(err).status(400);
            return
        }
        res.send(JSON.stringify(response)).status(200);
    });
});
//==============[Peticion POST => Para eliminar un dispositivo] ============================
app.post('/deleteDevice/',function(req,res){
    console.log("Delete device");
    //console.log([req.query.state, req.query.idDevice]);
    utils.query('delete from Devices where id = ?',
    [req.body.idDevice],(err,response) =>{
        if(err){
            throw err;
            res.send(err).status(400);
            return
        }
        response.tipo = 'delete_ok';
        res.send(JSON.stringify(response)).status(200);
    });
})




app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
