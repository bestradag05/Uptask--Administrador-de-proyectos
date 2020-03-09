
eventListeners();

// Lista de proyectos

var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners()
{
    // boton para crear proyecto
    
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
    
    // boton para una nueva tarea
    
    document.querySelector('.nueva-tarea').addEventListener('click',agregarTarea);
   
   //Botones para las acciones de las tareas
   
   document.querySelector('.listado-pendientes').addEventListener('click',accionesTarea);
   
}

function nuevoProyecto(e)
{
    e.preventDefault();
    
  // crea un input para el nombre del nuevo proyecti
    
  var nuevoProyecto = document.createElement('li');
  nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
  listaProyectos.appendChild(nuevoProyecto);
  
  //Seleccionar el ID con el nuevo proyecto
  
  var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
  
  // al presionar enter crear un proyecto
  
  inputNuevoProyecto.addEventListener('keypress', function(e)
  {
    var tecla = e.wich || e.keyCode;
    
    if(tecla == 13)
    {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
    }
  });
}

function guardarProyectoDB(nombreProyecto)
{
    // Crear llamado ajac
    
    var xhr = new XMLHttpRequest();
    //enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion','crear');
    // abrir la conexion
    
    xhr.open('POST','inc/modelos/modelo-proyecto.php', true);
    
    
    //En la carga
    
    xhr.onload = function()
    {
        if(this.status === 200)
        {
            var respuesta = JSON.parse(xhr.responseText);
            
            var proyecto = respuesta.nombre_proyecto,
                    id_proyecto = respuesta.id_insertado,
                    tipo = respuesta.accion,
                    resultado = respuesta.respuesta;
            
            // Comprobar la insercion
            
            if(resultado == 'Correcto')
            {
                if(tipo == 'crear')
                {
                     var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                            <a href='index.php?id_proyecto=${id_proyecto}' id="proyecto:${id_proyecto}">
                             ${nombreProyecto}
                             </a>
                                    `;
                    listaProyectos.appendChild(nuevoProyecto);
                    
                    // Enviar alerta
                    
                    Swal({
                        type: 'success',
                        title: 'Proyecto Creado',
                        text:  nombreProyecto + ' se creo correctamente'
                    })
                    
                    // redirecciona a la nueva url
                    .then(respuesta => {
                                    if (respuesta.value)
                                    {
                                        window.location.href= 'index.php?id_proyecto=' + id_proyecto;
                                    }
                                });
                }
            }else
            {
                Swal({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    });
            }
        }
    };
    
    xhr.send(datos);
    

}

//Agregar una nueva tarea del proyecto actual

 function agregarTarea(e)
 {
     e.preventDefault();
     
     var nombreTarea= document.querySelector('.nombre-tarea').value;
     
     //validar que el campo nombre de la tarea no este vacia
     
     if(nombreTarea=="")
     {
         Swal({
                type: 'error',
                title: 'Error',
                text: 'Una tarea no puede ir vacia'
            });
     }else
     {
         //Crear llamado a ajax
         
         var xhr= new XMLHttpRequest();
         
         //Crear formdata
         var datos = new FormData();
         datos.append('tarea',nombreTarea);
         datos.append('accion','crear');
         datos.append('id_proyecto',document.querySelector('#id_proyecto').value);
         
         //Abrir conexion
         
         xhr.open('POST','inc/modelos/modelo-tareas.php', true);
         //Ejecutarlo y respuesta
         xhr.onload = function()
         {
             if(this.status === 200)
             {
                 var respuesta= JSON.parse(xhr.responseText);
                 if(respuesta.respuesta=='Correcto')
                 {
                     //Se agrego correctamente
                     
                     if(respuesta.accion == 'crear')
                     {
                        Swal({
                        type: 'success',
                        title: 'Tarea Creada',
                        text: 'La tarea: '+ respuesta.tarea +' se creo correctamente'
                             });
                             
                             //Seleccionar el parrafo con la lista vacia
                             
                             var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                             
                             if(parrafoListaVacia.length > 0)
                             {
                                 document.querySelector('.lista-vacia').remove();
                             }
                             // Crear Templade
                             
                             var nuevaTarea = document.createElement('li');
                             //Agregamos el ID
                             
                             nuevaTarea.id='tarea:'+respuesta.id_insertado;
                             //Clase tarea
                             nuevaTarea.classList.add('tarea');
                             //construir en el html
                             nuevaTarea.innerHTML = `
                                <p>${respuesta.tarea}</p>
                                <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                                </div>
                               `;
                         
                         //Agregrlo al html
                         var listado = document.querySelector('.listado-pendientes ul');
                         listado.appendChild(nuevaTarea);
                         
                         //Limpiar formulario
                         
                         document.querySelector('.agregar-tarea').reset;
                     }
                     
                     
                 }else
                 {
                     //Hubo un error
                     
                      Swal({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    });
                 }
             }
         }
         //Enviar la consulta
         
         xhr.send(datos);
     }
 }
 
 // Cambia el estado de las tareas o elimnarlas
 
 function accionesTarea(e)
 {
     e.preventDefault();
     //Delegacion
     // Se puede capturar un contenedor y con el e.target
     // podemos delegar el evento al componente que estemos dando click
     
     
    if(e.target.classList.contains('fa-check-circle')) {
        if(e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    
    if(e.target.classList.contains('fa-trash'))
    {
         Swal.fire({
          title: 'Seguro(a)?',
          text: "Esta accion no se puede deshacer!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, estoy seguro!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
              
              var tareaEliminar = e.target.parentElement.parentElement;
              
              //Borrar de la bd
              
              eliminarTareaBD(tareaEliminar);
              
              //Borrar del html
              
             tareaEliminar.remove();
              
            Swal.fire(
              'Eliminado!',
              'La tarea fue eliminado.',
              'success'
            )
          }
        })
              
        
        
      
    }
    
    

  
  
 }
 
 // Completa o descompleta una tarea
 
 function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    
    // crear llamado ajax
    var xhr = new XMLHttpRequest();
    
    // informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    
    // abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    
    // on load
    xhr.onload = function() {
        if(this.status === 200) {
            $respuesta=JSON.parse(xhr.responseText);
            
            console.log($respuesta);
            
        }
    }
    // enviar la peticiÃ³n
    xhr.send(datos);
}

//Elimina las tareas de la Bd
function eliminarTareaBD(tarea)
{
    
    var idTarea = tarea.id.split(':');
    
    // crear llamado ajax
    var xhr = new XMLHttpRequest();
    
    // informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');
    
    
    // abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    
    // on load
    xhr.onload = function() {
        if(this.status === 200) {
            $respuesta=JSON.parse(xhr.responseText);
            
            // Comprobar que haya tareas restantes
            
            var listaTareaRestantes= document.querySelectorAll('li.tarea');
            
            if(listaTareaRestantes.length ==0)
            {
                document.querySelector('.listado-pendientes ul').innerHTML="<p class='lista-vacia'> no hay tareas en este proyecto</p>";
            }
            
        }
    }
    // enviar la peticiÃ³n
    xhr.send(datos);
    
}