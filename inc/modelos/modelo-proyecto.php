<?php

$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];



if($accion == 'crear')
{
 
    // importar la conexion
    include '../function/conexion.php';
    
    try {
        //consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?)");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        
        if($stmt->affected_rows > 0)
        {
            $respuesta = array(
                'respuesta' => 'Correcto',
                'id_insertado' => $stmt->insert_id,
                'accion' => $accion,
                'nombre_proyecto' => $proyecto
            );
        } else {
            
            $respuesta = array(
                'respuesta' => 'Error'
            );
        }
        
        $stmt ->close();
        $conn->close();
    } catch (Exception $e) {
        
      
        $respuesta= array(
        'error' => $e->getMessage()
                
    );
    }

    echo json_encode($respuesta);
}




    
    
