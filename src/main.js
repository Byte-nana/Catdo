'use strict';

// 1. Add
// 2. check
// 3. delete
// 4. filters
// 5. darkMode
// 6. localStorage

const form = document.querySelector('.footer__form');
const textInput = document.querySelector('#form__input');
const itemContainer = document.querySelector('.main__items');

// pretend LocalStorage data
const todos = [
  { id: crypto.randomUUID(), text: 'Finish to-do list', status: 'active' },
  {
    id: crypto.randomUUID(),
    text: 'Post LinkedIn of to-do list',
    status: 'active',
  },
];
renderTodos(todos);

// 1. Add
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = textInput.value.trim();

  if (!text) {
    textInput.value = '';
    textInput.focus();
    return;
  }

  const newTodo = {
    id: crypto.randomUUID(),
    text,
    status: 'active',
  };
  todos.push(newTodo);

  const item = createItem(newTodo);
  itemContainer.appendChild(item);
  textInput.value = '';
  textInput.focus();
});

function createItem(todo) {
  const item = document.createElement('li');
  item.setAttribute('class', 'item__row');

  item.innerHTML = `
    <input class="item__checkbox" type="checkbox" />
    <label class="item__name">${todo.text}</label>
    <button
        class="item__deleteBtn"
        type="button"
        aria-label="button for deleting to-do list"
    >
        <i class="fa-solid fa-trash"></i>
    </button>
  `;

  return item;
}

// 6. LocalStorage
// render todos
function renderTodos(todos) {
  todos.forEach((todo) => {
    const item = createItem(todo);
    itemContainer.appendChild(item);
  });
}
