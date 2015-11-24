//Para funciones utilizadas no encontradas en este archivo, revisar librerias.js
// Variable path es rescatado de las librerias.

function jugadores(){

    this.id_jugador
    this.nombre
    this.email

    this.addJugador = function(){
    	if(this.validarJugador()){
    		var xhr = new XMLHttpRequest();
	        var add = new FormData();
	        add.append('nombre_usuario',this.nombre);
	        add.append('email_usuario',this.email);
	        add.append('equipo',localStorage.getItem('equipo'));
            if(document.querySelector('input[name="jg-radio-posicion"]:checked') !== null){
                add.append('posicion',document.querySelector('input[name="jg-radio-posicion"]:checked').value);
            } else {
                add.append('posicion',1);
            } 
	        xhr.open('POST', path + 'app/addJugador');
	        xhr.setRequestHeader('Cache-Control', 'no-cache');
	        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	        xhr.send(add);
	        xhr.onload = function(e){
	            if(this.status == 200){
                    if(this.response){
                    	document.getElementById('jg-nombre').value = '';
    					document.getElementById('jg-email').value = '';
                        navigator.notification.alert('El jugador se agrego satisfactoriamente',function(){},'Atención','OK');
                    	//alert("El jugador fue agregado satisfactoriamente");
                        //document.getElementById('reg-email-duplicate-error').style.display = "block";
                    } else {
                        navigator.notification.alert('Ocurrio un error, intentelo nuevamente',function(){},'Atención','OK');
                    	//alert("ocurrio un error, intentelo nuevamente");
                        //$.mobile.navigate("#registro-equipo", {transition: "slide"});
                    }
	            }
	        }
    	}
    }

    this.getJugadores = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',localStorage.getItem('equipo'));
        send.append('id_evento',sessionStorage.getItem('evento'))
        xhr.open('POST', path + 'app/getJugadores');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.timeout = 10000;
        xhr.onprogress = function(e){
            $.mobile.loading('show');
        }
        xhr.ontimeout = function(e){
            navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');   
        }
        xhr.onload = function(e){
            //alert(this.response);
            $.mobile.loading('hide');
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = '<a href="#add-jugadores"><div class="agregar_jugador"></div></a>';
                    var checked = '';
                    $("#set-titulares").html(inc).trigger('create');
                    for(var i = 0; i < json.length; i++ ){
                        //if(json[i].titular != ''){
                            checked = (json[i].titular) ? 'checked':'';
                        //}       
                        inc = "<li data-icon='false' class='li-padding'>";
                        inc += "<input name='jg-titular[]' id='st"+json[i].id_usuario+"' type='checkbox' "+checked+" onclick='setTitular("+json[i].id_usuario+")'>";
                        inc += "<label for='st"+json[i].id_usuario+"'>";
                        inc += "<div class='imagen_jugador'><img src='jquerymobile/img-dportes/foto.png'></div>";
                        inc += "<h2>"+json[i].nombre+"</h2>";
                        inc += "<p>"+json[i].posicion+"</p></label></li>";
                        $("#set-titulares").append(inc).trigger('create');
                    };
                    //document.getElementById('set-titulares').innerHTML = inc;
                } else {
                    navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');
                }
            }
        }
    }

    this.getJugadoresEstadisticas = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',localStorage.getItem('equipo'));
        send.append('id_evento',sessionStorage.getItem('evento'))
        xhr.open('POST', path + 'app/getJugadoresEstadisticas');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.onprogress = function(e){
            $.mobile.loading('show');
        }
        xhr.onload = function(e){
            $.mobile.loading('hide');
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = '';
                    for(var i = 0; i < json.length; i++ ){
                        inc += "<li>";
                        inc += "<a onclick='setHistorialJG("+json[i].id_usuario+",\""+json[i].nombre+"\",\""+json[i].posicion+"\")' href='#' class='color-boton-equipo'><img src='jquerymobile/img-dportes/foto.png'>";
                        inc += "<h2>"+json[i].nombre+"</h2>";
                        inc += "<p>"+json[i].posicion+"</p>";
                        inc += "</a>";
                        inc += "</li>";
                    }
                    $("#stat-jg-list").html(inc).listview('refresh');
                }
            }
        }       
    }

    this.setTitulares = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_usuario',this.id_jugador);
        send.append('id_evento',sessionStorage.getItem('evento'));
        send.append('id_equipo',localStorage.getItem('equipo'));
        xhr.open('POST', path + 'app/setTitular');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        /*xhr.onload = function(e){
            if(this.status == 200){
                alert(this.response);
            }
        }*/    
    }

    this.getTitulares = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_evento',sessionStorage.getItem('evento'));
        send.append('id_equipo',localStorage.getItem('equipo'));
        xhr.open('POST', path + 'app/getTitulares');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.onload = function(e){
            //alert(this.response);
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var id = 0;
                    var cont = 0;
                    var clase = '';
                    var inc = '';
                    var disabled = '';
                    var roja = '';
                    var amarilla = '';
                    var doubleAmarilla = '';
                    var cambio = '';
                    var goles = '';

                    document.getElementById('acc-jugadores').innerHTML = inc;
                    for(var i = 0; i < json.length; i++ ){

                        roja = 'display:none';
                        amarilla = 'display:none';
                        doubleAmarilla = 'display:none';
                        cambio = 'display:none';
                        goles = 'display:none';
                        if(i%4 == 0){
                            id = getDivAcc(json[i].id_usuario);
                            cont = 0;
                        }
                        cont++;
                        if(cont == 1){
                            clase = 'a';
                        } else if(cont == 2){
                            clase = 'b';
                        } else if(cont == 3){
                            clase = 'c';
                        } else if(cont == 4){
                            clase = 'd';
                        }

                        

                        if(json[i].roja != 0 || json[i].amarillas > 0){
                            
                            if(json[i].roja != 0 && json[i].amarillas > 1){
                                doubleAmarilla = 'display:block';
                                amarilla = 'display:none';
                                roja = 'display:none';
                                disabled = 'ui-state-disabled';
                            } else if(json[i].roja != 0 && json[i].amarillas == 0){
                                doubleAmarilla = 'display:none';
                                amarilla = 'display:none';
                                roja = 'display:block';
                                disabled = 'ui-state-disabled';
                            } else if(json[i].roja == 0 && json[i].amarillas == 1){
                                doubleAmarilla = 'display:none';
                                amarilla = 'display:block';
                                roja = 'display:none'; 
                            } else if(json[i].roja != 0 && json[i].amarillas == 1){
                                doubleAmarilla = 'display:none';
                                amarilla = 'display:block';
                                roja = 'display:block';
                                disabled = 'ui-state-disabled';
                            }
                        } else {
                            disabled = '';
                        }

                        if(json[i].cambio == 1){
                            cambio = 'display:block';
                        } else {
                            cambio = 'display:none';
                        }

                        if(json[i].goles > 0){
                            goles = 'display:block';
                        } else {
                            goles = 'display:none';
                        }

                        inc = "<div id='jgActivo"+json[i].id_usuario+"' class='ui-block-"+clase+" centrar_jugador "+disabled+"'>";
                        inc += "<div style='position:relative;'>";
                        inc += "<a onclick='setIDTitular("+json[i].id_usuario+")' href='#' class='ancho_grilla'>";
                        inc += "<img src='jquerymobile/img-dportes/foto.png'>";
                        inc += "<div class='contenedor_iconos_jugadas'>";
                        inc += "<img id='jugImg"+json[i].id_usuario+"' src='jquerymobile/img-dportes/iconos/icono_gol.png' style='"+goles+"'>";
                        inc += "<div id='jugGoles"+json[i].id_usuario+"' class='marcador-personal-goles' style='"+goles+"'>"+json[i].goles+"</div>";
                        inc += "<div id='jugTarjetaRoja"+json[i].id_usuario+"' style='"+roja+"'><img src='jquerymobile/img-dportes/iconos/icono_roja.png'></div>";
                        inc += "<div id='jugTarjetaAmarilla"+json[i].id_usuario+"' style='"+amarilla+"'><img src='jquerymobile/img-dportes/iconos/icono_amarilla.png'></div>";
                        inc += "<div id='jugCambio"+json[i].id_usuario+"' style='width:26px; "+cambio+"'><img src='jquerymobile/img-dportes/iconos/icono_cambio.png'></div>";
                        inc += "<div id='jugDoble"+json[i].id_usuario+"' style='width:45px; "+doubleAmarilla+"'><img src='jquerymobile/img-dportes/iconos/icono_doble_amarilla.png'></div>";
                        inc += "</div>";
                        inc += "</a>";
                        inc += "<span class='nombre-jugador-accion'>"+json[i].nombre+"</span>";
                        inc += "</div>";
                        inc += "</div>";
                        $('#'+id).append(inc).trigger('create');
                    }
                    /*var inc = "<div class='ui-grid-c'>";
                    for(var i = 0; i < json.length; i++ ){
                        if((i+1)%4 == 0){
                            inc += "</div>";
                            inc += "<div class='ui-grid-c'>";
                        }
                        inc += "<div class='ui-block-a centrar_jugador'><a href='#jugada_partido' class='ancho_grilla'><img src='jquerymobile/img-dportes/jugador1.jpg'></a><span class='nombre-jugador-accion'>Francisco quezada</span></div>";
                    }
                    inc += "</div>";
                    $('#acc-jugadores').html(inc).trigger('create');*/
                    //document.getElementById('acc-jugadores').innerHTML = inc;
                }
            }
        }
    }

    this.getJugadoresReserva = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',localStorage.getItem('equipo'));
        send.append('id_evento',sessionStorage.getItem('evento'));
        xhr.open('POST', path + 'app/getJugadoresReserva');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.timeout = 10000;
        xhr.onprogress = function(e){
            $.mobile.loading('show');
            var inc = '';
            $("#jg-reservas").html(inc).trigger('create');
            $("#jg-reservas").listview('refresh');
        }
        xhr.ontimeout = function(e){
            navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');   
        }
        xhr.onload = function(e){
            //alert(this.response);
            $.mobile.loading('hide');
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = '';
                    for(var i = 0; i < json.length; i++ ){  
                        inc += "<li data-icon='false' class='li-padding' >";
                        inc += "<a href='#' onclick='backAcciones("+json[i].id_usuario+")'>";
                        inc += "<img src='jquerymobile/img-dportes/foto.png'>";
                        inc += "<h2>"+json[i].nombre+"</h2>";
                        inc += "<p>"+json[i].posicion+"</p></a></li>";
                    };
                    $("#jg-reservas").html(inc).trigger('create');
                    $("#jg-reservas").listview('refresh');
                } else {
                    navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');
                }
            }
        }


    }

    this.getPosiciones = function(){
        var dporte = 1;
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_dporte',dporte);
        xhr.open('POST', path + 'app/getPosiciones');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.onload = function(e){
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = "";
                    for(var i = 0; i < json.length; i++ ){
                        inc += "<input name='jg-radio-posicion' value="+json[i].id_posicion+" id='jg-rad-"+json[i].id_posicion+"' type='radio'>";
                        inc += "<label for='jg-rad-"+json[i].id_posicion+"' >"+json[i].nombre+"</label>";
                    }
                    $('#jg-posiciones').html(inc).trigger('create');
                }
            }
        }
    }

    this.validarJugador = function(){
    	var bNombre 	= false;
    	var bEmail 		= false;

    	if(this.nombre.trim().length <= 0){
            document.getElementById('jg-nombre-error').style.display = "block";
    	} else {
            document.getElementById('jg-nombre-error').style.display = "none";
    		bNombre = true;
    	}

    	if(validaEmail(this.email)){
    		document.getElementById('jg-email-format-error').style.display = "block";
    	} else {
            document.getElementById('jg-email-format-error').style.display = "none";
    		bEmail = true;
    	}

    	if(bNombre && bEmail){
    		return true;
    	} else {
    		return false;
    	}
    }

    this.validaTitulares = function(){
        var count = $('[name="jg-titular[]"]:checked').length;
        if(count>0){
            return true;
        } else {
            return false;
        }
    }


}

function setHistorialJG(id,nombre,posicion){
    sessionStorage.jugador = id;
    sessionStorage.dt_nombre = nombre;
    sessionStorage.dt_posicion = posicion;
    $.mobile.navigate("#detalle-jugador", {transition: "fade"});
}

function setTitular(id){
    var jg = new jugadores();
    jg.id_jugador = id;
    jg.setTitulares();
    delete jg;
}

function getDivAcc(id){
    var inc = "<div id='rowAcc"+id+"' class='ui-grid-c'></div>";
    $('#acc-jugadores').append(inc).trigger('create');
    return "rowAcc"+id;
}

function setIDTitular(id){
    //#jugada_partido
    sessionStorage.accIDTitular = id;
    //alert(localStorage.getItem('accIDTitular'));
    $( "#jugada_partido" ).panel( "open" );
}


//$(document).on("pagecreate","#seleccionar-titulares",function(){
$(document).on("pagebeforeshow","#seleccionar-titulares",function(){
    var jg = new jugadores();
    jg.getJugadores();
    delete jg;
});

document.getElementById('add-jg').addEventListener('click',function(){

    event.preventDefault();
    var jg = new jugadores();
    jg.nombre 	= document.getElementById('jg-nombre').value;
    jg.email 	= document.getElementById('jg-email').value;
    jg.addJugador();
    delete jg;
});

$(document).on("pagecreate","#add-jugadores",function(){
    var jg = new jugadores();
    jg.getPosiciones();
    delete jg;
});

document.getElementById('jg-valida-titulares').addEventListener('click',function(){
    event.preventDefault();
    var jg = new jugadores();
    if(jg.validaTitulares()){
        $.mobile.navigate("#panel-juego", {transition: "fade"});
    } else {
        navigator.notification.alert('Seleccione al menos una persona titular para el partido',titularesDismissed,'Atención','OK');
    }
    delete jg;
});

function backAcciones(id){
    var xhr = new XMLHttpRequest();
    var send = new FormData();
    send.append('sale',sessionStorage.getItem('accIDTitular'));
    send.append('entra',id);
    send.append('id_evento',sessionStorage.getItem('evento'));
    send.append('id_equipo',localStorage.getItem('equipo'));
    xhr.open('POST', path + 'app/cambioJugadores');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(send);
    xhr.timeout = 10000;
    xhr.onprogress = function(e){
        $.mobile.loading('show');
    }
    xhr.ontimeout = function(e){
        navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');   
    }

    xhr.onload = function(e){
        //alert(this.response);
        if(this.status == 200){
            if(this.response){
                $.mobile.loading('hide');
                $.mobile.navigate("#acciones", {transition: "fade"});
            }
        }
    }

}

function titularesDismissed(){

}
