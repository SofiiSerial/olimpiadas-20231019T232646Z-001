var express = require('express');
var router = express.Router();
var con = require('../conexion');

const rand = function(){
    return Math.random().toString(36).substr(2);
};

const getToken = function(){
    return rand() + rand ();

};

const isAdmin = function(token){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT rol FROM usuarios WHERE token = ?';
        con.query(sql, [token], function(error, result, cant){
       
            if(error){
                
                reject(error);  
        
            } else {
                if (result.length === 0)return( reject("No existe"));
                resolve(result[0].rol); 
            
            }

        })
    })
}

 //llamar guardar puntaje para cada color
router.get("/buscar",function(req, res, next){
    const {} = req.query
    const sql=`SELECT C.color, SUM(P.puntaje) as puntaje1" FROM puntajes
    INNER JOIN colores AS C ON P.id_color = C.id_color GROUP BY P.id_color;
    WHERE P.id_color = ?`
    con.query(sql, [], function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{

            res.json({
                status:"puntaje",
                puntaje: result
            })
        }
    })
})

router.get("/",function(req, res, next){
    //const {} = req.query
    const sql=`SELECT C.color, SUM(P.puntaje) as puntajes FROM puntajes AS P
    INNER JOIN colores AS C ON P.id_color = C.id_color GROUP BY P.id_color;`
    con.query(sql, [], function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{

            res.json({
                status:"puntaje",
                puntaje: result
            })
        }
    })
})

router.post("/",function(req, res, next){
    const { id_juegos, id_color, puntaje } = req.body
    const {token} = req.headers
    isAdmin(token)
    .then((rol) => {
        console.log(rol);
        if (rol === "admin"){
            const sql = 'INSERT INTO puntajes (id_juegos, id_color, puntaje) VALUES (?, ?, ?)'

            con.query(sql, [ id_juegos, id_color, puntaje], function(error, result){
                if(error){
                    res.json({
                        status:"error",
                        error  
                    })  
           
                } else {
                    res.json({
                        status:"puntajes",
                        msj:"ok"
                    })
                }
            })
        }
    })
    .catch((error)=> {
        res.json({
            status:"error",
            error  
        })  
    }) 
    
})

/*
router.post("/guardarPuntaje",function(req, res, next){
    const {id_juegos, id_color, puntaje } = req.body
    const sql = `INSERT INTO puntajes (id_juegos, id_color, puntaje) VALUES (?, ?, ? )`

    con.query(sql, [ id_juegos, id_color, puntaje], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"ok"
            })
        }
    })
})*/

router.put("/",function(req, res, next){
    //const {id} = req.query; //es la tabla donde queremos cambiar los datos
    const {id, puntaje} = req.body; //recibe los datos que qiere cambiar
    const sql = 'UPDATE puntajes SET puntaje = ? WHERE id = ?'

    con.query(sql, [puntaje, id], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"ok",
                msj:{ }
            })
        }
    })
})  


module.exports = router;