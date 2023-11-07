var express = require('express');
var con = require('../conexion');
var router = express.Router();

router.get("/",function(req, res, next){

    const sql = 'SELECT * FROM colores';
    con.query(sql,function(error, result){

        res.json({
            status:"colores",
            colores:result
            
        })
        
    })
    //SQL listado de colores
})

router.post("/",function(req, res, next){
    const {descripcion, tipo} = req.body
    console.log({descripcion, tipo});

    const sql = 'INSERT INTO colores (descripcion, tipo) VALUES (?, ?)'

    con.query(sql, [descripcion, tipo], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"colores",
                msj:{descripcion, tipo}
            })
        }
    })
})

router.put("/",function(req, res, next){
    const {id_color} = req.query;
    const {color} = req.body;
    const sql = 'UPDATE colores SET color = ? WHERE id_color = ?'

    con.query(sql, [ color, id_color], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"colores",
                msj:{descripcion, tipo}
            })
        }
    })
})

const isAdmin = function(token){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT tipo FROM Usuarios WHERE token = ?';
        con.query(sql, [token], function(error, result, cant){

            if(error){
                reject(error);  
        
            } else {

                if (result.length === 0)return( reject("No existe"));
                resolve(result[0].tipo); 
            
            }

        })
    })
}

    


module.exports = router;