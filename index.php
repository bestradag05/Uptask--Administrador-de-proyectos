<?php 
 include 'inc/function/sesiones.php'; 
 include 'inc/function/funciones.php'; 
 include 'inc/templastes/header.php'; 

 
 //Obtener el Id de la URL
 
 if(isset($_GET['id_proyecto']))
 {
     $id_proyecto = $_GET['id_proyecto'];
 }
 
 
    include 'inc/templastes/barra.php'; 

 ?>



<div class="contenedor">
   
    <?php 
 include 'inc/templastes/sidebar.php'; 
 
 ?>

    <main class="contenido-principal">
        <?php 
        $proyecto = obtenerNombreProyecto($id_proyecto);
        
        
        if($proyecto): ?>
        <h1> Proyecto Actual:
                 <?php foreach ($proyecto as $nombre): ?>

            <span><?php echo $nombre['nombre']; ?></span>
                <?php endforeach; ?>
        </h1>

        <form action="#" class="agregar-tarea">
            <div class="campo">
                <label for="tarea">Tarea:</label>
                <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
            </div>
            <div class="campo enviar">
                <input type="hidden" id="id_proyecto" value="<?php echo $id_proyecto; ?>">
                <input type="submit" class="boton nueva-tarea" id="nueva-tarea" value="Agregar">
            </div>
        </form>
        
        <?php
        else:
            // Si no hay proyectos seleccionados
            
            echo "<p> Seleccione un proyecto a la izquierda. </p>";
            
        endif;
        
        ?>

        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul>
                <?php 
                $tareas = obtenerTareasProyecto($id_proyecto);
                
                if($tareas->num_rows > 0)
                {
                    foreach ($tareas as $tareas): ?>
                
                <li id="tarea:<?php echo $tareas['id'] ?>" class="tarea">
                <p><?php echo $tareas['nombre'] ?></p>
                    <div class="acciones">
                        <i class="far fa-check-circle <?php echo ($tareas['estado']=='1'? 'completo': '')?>"></i>
                        <i class="fas fa-trash"></i>
                    </div>
                </li>   
                        
                   <?php endforeach; 
                    
                }else
                {
                    echo "<p class='lista-vacia'> no hay tareas en este proyecto</p>";
                }
                ?>

               
            </ul>
        </div>
    </main>
</div><!--.contenedor-->





<?php include 'inc/templastes/footer.php'; ?>