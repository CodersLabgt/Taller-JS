function init() {
	var todo = ToDo("#ToDoList");
	todo.render(); //Se muestra el contenido almacenado en localStorage sobre todas las tareas (si en dado caso hubieran almacenadas)
	todo.update();

	var inputGuardar = document.querySelector("#todo-input"); //Obtenemos el input donde el usuario escribirá
	document.body.addEventListener("click", function click(params) { //Escuchando el evento click de todo nuestro body
		if(params.target.classList.contains("btn-complete")) { //Se valida cuando el elemento al que se le dio clicck contenga la clase btn-complete
			var btn = params.target;
			var id;
			if(btn.classList.contains("active")) { //Si el elemento al que se le dio click tiene la clase "active" (que ya fue completada), entonces... hacer lo siguiente
				btn.classList.remove("active");
				btn.nextSibling.classList.remove("complete");
				id = btn.getAttribute("data-id");
				todo.changeState(id, false); //Se cambia el estado de la tarea 
			}
			else { //Tarea completada
				btn.classList.add("active");
				btn.nextSibling.classList.add("complete");
				id = btn.getAttribute("data-id");
				todo.changeState(id, true);
			}
			todo.update();
		}
	});

	inputGuardar.addEventListener('keypress', function click(key) {
		if(key.charCode == 13) { //Se comprueba que el usuario presionó la tecla Enter
			if(inputGuardar.value.trim() != "") {
				todo.add( inputGuardar.value.trim() ); //Se envía lo que el usuario escribió (borrando los espacios en blanco a los lados) a la función add de ToDo
				inputGuardar.value = ""; //Se borra el contenido que había en el input
			}
		}
	});


};

function ToDo(list) {
	var listElement = document.querySelector(list);
	var addToList = function renderToList(item) {
		var li = document.createElement("li");
		li.innerHTML = "<div><span data-id='"+ item.id +"' class='btn-complete'></span><p>"+ item.tarea +"</p></div>"
		listElement.appendChild(li);
		updateTextPending();
	};
	var updateTextPending = function _update() {
		var texto = document.getElementById("pendientes"); 
		/*
			El elemento con el id "pendientes" es el párrafo que aparece hasta abajo de 
			las tareas que nos informa la cantidad de tareas pendientes (únicamente pendientes) de
			esta manera: 2 tareas pendientes
		*/
		var cantidad = 0;
		if(localStorage["store-list"]) { //Se comprueba si ya hay datos almacenados en localStorage["store-list"]
			var store = JSON.parse(localStorage["store-list"]);
			store.forEach(function _each(item, index) { //Se recorre todo el contenido de nuestra información almacenada en localStorage
				if(!item.completado) { //Se valida si la tarea no está completada
					cantidad += 1; //Se incrementa en uno la variable cantidad
				}
			});
		}
		texto.innerText = cantidad + " tareas pendientes";
	};
	
	var changeState = function (id, val) { //Función que cambiará el estado de completado (true o false) de cada tarea
		/*
			Esta función recibe dos argumentos: id y val (Es indiferente el nombre que le 
			ponga a los argumentos.  Le hubiera podido poner pepito y juanita, y hubiera 
			funcionado igual)
			El argumento id recibirá el id que identifica a cada tarea.
			El argumento val recibirá el nuevo estado (true o false, completado o no completado) de la tarea
		*/
		var store = JSON.parse(localStorage["store-list"]);
		for(var i = 0 ; i < store.length ; i++) {
			if(store[i].id == id) {
				store[i].completado = val;
				break;
			}
		}
		localStorage["store-list"] = JSON.stringify(store);
	};
	

	/*Público*/
	return {
		add: function add(item) { //Función que contiene la lógica de guardado de las taras en localStorage
			var _item;
			if(!localStorage["store-list"]) {
				_item = {id: 1, tarea: item, completado: false};
				localStorage["store-list"] = JSON.stringify([_item]);
			}
			else {
				var store = JSON.parse(localStorage["store-list"]); //[{id: 1, tarea: "..."}]
				_item = {id: store.length+1, tarea: item, completado: false};
				store.push(_item);
				localStorage["store-list"] = JSON.stringify(store);
			}
			addToList(_item);
			return;
		},
		changeState: changeState,
		update: updateTextPending,
		render: function render() {
			if(localStorage["store-list"]) {
				var data = JSON.parse(localStorage["store-list"]); //Se obtiene el contendo en store-list para poder manipularlo
				var str = "";

				//forEach para recorrer el array
				data.forEach(function _each(item, index) {
					if(item.completado) str += "<li><div><span data-id='"+ item.id +"' class='btn-complete active'></span><p class='complete'>"+ item.tarea +"</p></div></li>";
					else str += "<li><div><span data-id='"+ item.id +"' class='btn-complete'></span><p>"+ item.tarea +"</p></div></li>";
				});
				listElement.innerHTML = str;
			}
		}
	};
};

window.addEventListener('load', init); //Se escucha el evento load de la página.  El evento load se dispara cuando el navegador termina de cargar todos los archivos.