<?php


$accion = $_POST['accion'];
$usuario = $_POST['usuario'];
$password = $_POST['password'];
        
if($accion == 'crear')
{
    // Codigo para crear los administradores
    
    
    //hashear passwords
    $opciones = array(
      'cost' => 12  
    );
    
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    // importar la conexion
    include '../function/conexion.php';
    
    try {
        //consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?,?)");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        
        $respuesta= array(
        'respuesta' => 'Correcto',
         'id_insertado' =>  $stmt->insert_id,
         'accion' => $accion
                
    );
        
        $stmt ->close();
    } catch (Exception $e) {
        
        //tomar la exepcion
         $e->getMessage();
    }

    echo json_encode($respuesta);
}


if($accion === 'login')
{
    
    include '../function/conexion.php';
    
    try {
        //Seleccionar el administrador de la base de datos
        
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios where usuario= ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        // Logear el usuario 
        $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
        
        $stmt->fetch();
        
       if($nombre_usuario)
       {
           //El usuario existe, verifica password
           
           if(password_verify($password, $pass_usuario))
           {
               //iniciar la session
               
               session_start();
               $_SESSION['nombre'] = $usuario;
               $_SESSION['id'] = $id_usuario;
               $_SESSION['login'] = true;
               
               //Login correcto
               $respuesta = array(
                    'respuesta'=> 'Correcto',
                    'nombre'=> $nombre_usuario,
                    'accion' => $accion
                 
               );
               
           }else
           {
               //Login incorreco
               $respuesta = array(
                   'resultado'=> 'password incorrecto'
               );
           }
           
           
       }else
       {
           $respuesta = array(
               'error' => 'Usuario no Existe'
           );
                   
       }
        
       
        $stmt->close();
        $conn->close();
        
    } catch (Exception $e) {
       $respuesta = array(
               'pass' => $e->getMessage()
           );
    }

    echo json_encode($respuesta);
}

?>
