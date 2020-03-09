<?php

$accion = $_POST['accion'];







if($accion == 'crear')
{
        
    $id_proyecto = (int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];
    // importar la conexion
    include '../function/conexion.php';
    
    try {
        //consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?)");
        $stmt->bind_param('si', $tarea,$id_proyecto);
        $stmt->execute();
        
        if($stmt->affected_rows > 0)
        {
            $respuesta = array(
                'respuesta' => 'Correcto',
                'id_insertado' => $stmt->insert_id,
                'accion' => $accion,
                'tarea' => $tarea
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

if($accion === 'actualizar') {

$estado = $_POST['estado'];
$id_tarea = $_POST['id'];   

include '../function/conexion.php';
    
    try {
        //consulta a la base de datos
        $stmt = $conn->prepare("UPDATE  tareas set estado=? WHERE id=?");
        $stmt->bind_param('ii', $estado,$id_tarea);
        $stmt->execute();
        
        if($stmt->affected_rows > 0)
        {
            $respuesta = array(
                'respuesta' => 'Correcto',
               
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

if($accion === 'eliminar') {


$id_tarea = $_POST['id'];   

include '../function/conexion.php';
    
    try {
        //consulta a la base de datos
        $stmt = $conn->prepare("DELETE FROM  tareas  WHERE id=?");
        $stmt->bind_param('i',$id_tarea);
        $stmt->execute();
        
        if($stmt->affected_rows > 0)
        {
            $respuesta = array(
                'respuesta' => 'Correcto',
               
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

    
    



    
    
