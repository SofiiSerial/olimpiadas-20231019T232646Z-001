var express = require('express');
var router = express.Router();
var con = require('../conexion');

//tiene que mostrar los dias de la semana con los juegos y el admin tiene q tener acceso para modificar
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


//para buscae un juego por tipo de juegos
router.get("/buscarTiposJuegos",function(req, res, next){
    const {id_tipo} = req.query
    const sql=`SELECT J.id_juegos, J.dia, J.hora, J.lugar, J.ganador, J.turno, T.deporte, T.descripcion
    FROM juegos AS J LEFT JOIN tipos_juegos AS T ON J.id_tipo = T.id WHERE T.id = ?`
    con.query(sql, [id_tipo], function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{

            res.json({
                status:"juegos",
                juegos: result
            })
        }
    })
})

router.get("/",function(req, res, next){
    const sql=`SELECT J.id_juegos, J.dia, J.hora, J.lugar, J.ganador, J.turno, T.deporte, T.descripcion
    FROM juegos AS J LEFT JOIN tipos_juegos AS T ON J.id_tipo = T.id`
    con.query(sql, function(error, result){
        if(error){
            res.json({
                status:"error",
                error
            })
        }else{
            res.json({
                status:"juegos",
                juegos: result
            })
        }
    })
})

// POST

router.post("/",function(req, res, next){
    const {id_tipo, dia, hora, lugar, ganador, turno } = req.body
    const {token} = req.headers
    isAdmin(token)
    .then((rol) => {
        console.log(rol);
        if (rol === "admin"){
            const sql = 'INSERT INTO juegos (id_tipo, dia, hora, lugar, ganador, turno) VALUES (?, ?, ?, ?, ?, ?)'
            
            con.query(sql, [id_tipo, dia, hora, lugar, ganador, turno], function(error, result){
                if(error){
                    res.json({
                        status:"error",
                        error  
                    })  
           
                } else {
                    res.json({
                        status:"juegos",
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

 
router.put("/",function(req, res, next){
   //const {id_juegos} = req.query; //es la tabla donde queremos cambiar los datos
    const { id_juegos, dia, hora, lugar, ganador, id_tipo, turno} = req.body; //recibe los datos que qiere cambiar
    const sql = 'UPDATE juegos SET  dia = ?, hora = ?, lugar = ?, ganador = ?, turno = ?, id_tipo = ? WHERE id_juegos = ?'

    con.query(sql, [ dia, hora, lugar, ganador, turno, id_tipo, id_juegos], function(error, result){
        if(error){
            res.json({
          status:"error",
             error  
            })  
       
        } else {
            res.json({
                status:"ok",
                msj:{ dia, hora, lugar, ganador, turno, id_tipo, id_juegos }
            })
        }
    })
})

module.exports = router;