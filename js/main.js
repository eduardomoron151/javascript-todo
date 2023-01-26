// constantes
const btnAgregarTarea = document.querySelector('#btnAgregarTarea');
const ul = document.querySelector('#lista-tareas');
let todoItems = [];

// Event Listeners

/**
 * Evento Al cargar el dom
 */
document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos los todos del localStorage
    const todosLocalStorate = localStorage.getItem('todoItemsRef');

    if(todosLocalStorate) {
        // Parseamos la data y la guardamos en el arreglo de todoItems
        todoItems = JSON.parse(todosLocalStorate);

        // Renderizamos cada uno de los elementos al DOM
        todoItems.forEach(todo => {
            render(todo)
        });
    }
})

/**
 * Evento para agregar Tarea
 */
btnAgregarTarea.addEventListener('click', e => {
    e.preventDefault();

    const tarea = document.querySelector('#tarea');
    const texto = tarea.value.trim();

    if(texto !== '') {
        agregarTodo(texto);
        tarea.value = '';
        tarea.focus();
    }
});

/**
 * Evento para Completar y/o eliminar tarea
 */
ul.addEventListener('click', e => {
    // Completar tarea
    if(e.target.classList.contains('completar-todo')) {
        const key = e.target.parentElement.dataset.key;
        completarTodo(key);
    }

    // ELiminar Tarea
    if(e.target.classList.contains('eliminar-todo')) {
        const key = e.target.parentElement.dataset.key;
        eliminarTodo(key);
    }
})


// Funciones

/**
 * Renderizado HTML de los todo
 */
const render = (todo) => {

    // Set de todoItems en localStorage
    localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));

    // Seleccion de elementos en el DOM
    const item = document.querySelector(`[data-key='${todo.id}']`);

    // Si el todo viene con la propiedad eliminado
    if(todo.eliminado) {
        // Eliminar el elemento del DOM
        item.remove();
        return
    }

    // Condicion para saber si esta completado el todo
    const estaCompletado = todo.estaCompletado ? 'terminada' : '';

    // Creamos la lista y la agregamos al dom
    const li = document.createElement('li');
    li.setAttribute('class', `${estaCompletado}`);
    li.setAttribute('data-key', todo.id);

    li.innerHTML = `
        <input class="completar-todo" id="${todo.id}" type="checkbox"/>
        <label for="${todo.id}" class="completar-todo"></label>
        <span>${todo.texto}</span>
        <button class="eliminar-todo">Eliminar</button>
    `;

    // si es el mismo item se reemplaza en el dom
    if(item) {
        ul.replaceChild(li, item);
    } else {
        ul.append(li);
    }

}

/**
 * Agregar Todo
 */
const agregarTodo = (texto) => {

    // Creamos el formato del todo
    const todo = {
        texto,
        estaCompletado : false,
        id : Date.now()
    }
    // Agregamos al arreglo de todoItems
    todoItems.push(todo);
    // Renderizamos los todos
    render(todo);
}

/**
 * Completar Todo
 */
const completarTodo = (key) => {

    // Buscamos el index en todoItems que coincida con el key
    const index = todoItems.findIndex(item => item.id === Number(key));

    // Cambiamos el estado del item en todoItems con el index
    todoItems[index].estaCompletado = !todoItems[index].estaCompletado;

    // pasamos a la funcion render con el item
    render(todoItems[index]);
}

/**
 * Eliminar Todo
 */
const eliminarTodo = (key) => {

    // Buscamo el index en todoItems
    const index = todoItems.findIndex(item => item.id === Number(key));

    // creamos el todo con una nueva propiedad eliminado
    const todo = {
        eliminado : true,
        ...todoItems[index]
    }

    // Eliminamos de todoItem el elemento
    todoItems = todoItems.filter(item => item.id !== Number(key));

    // Renderizamos el todo
    render(todo);

}