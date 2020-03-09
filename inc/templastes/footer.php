<script src="js/sweetalert2.all.min.js" type="text/javascript"></script>

<?php 

$actual = obtenerPaginaActual(); 

if($actual == 'crear-cuenta' || $actual == 'login')
{
    echo '<script src="js/formulario.js" type="text/javascript"></script>';
} else {
    echo '<script src="js/scripts.js" type="text/javascript"></script>';
}
      
?>

</body>
</html>