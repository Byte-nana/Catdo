'use strict';

const form = document.querySelector('.footer__form');
const textInput = document.querySelector('#form__input');
const itemContainer = document.querySelector('.main__items');
const filterBtns = document.querySelector('.header__filters');
const themeBtn = document.querySelector('.header__themeBtn');
const icon = themeBtn.querySelector('.fa-solid');

// Get items from local storage(if not initalise data)
let todos = getFromStorage('todos', []);
let category = getFromStorage('category', 'all');
let theme = getFromStorage('theme', defaultBrowserTheme());

saveData('todos', todos);
saveData('category', category);
saveData('theme', theme);

renderTodos(todos);
renderCategory();
renderTheme();

// Add todo items
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = textInput.value.trim();

  if (!text) {
    textInput.value = '';
    textInput.focus();
    return;
  }
  const newTodo = createTodoData(text);
  const item = createItem(newTodo);
  itemContainer.appendChild(item);

  item.scrollIntoView({ behavior: 'smooth' });
  textInput.value = '';
  textInput.focus();
});

function createTodoData(text) {
  const newTodo = {
    id: crypto.randomUUID(),
    text,
    status: 'active',
  };
  todos.push(newTodo);
  saveData('todos', todos);

  return newTodo;
}

function createItem(todo) {
  const item = document.createElement('li');
  item.setAttribute('class', 'item__row');
  item.setAttribute('data-id', todo.id);

  item.innerHTML = `
    <input 
        type="checkbox" 
        class="item__checkbox" 
        id="${todo.id}" 
        ${todo.status === 'completed' ? 'checked' : ''}
    />
    <label class="item__name" for="${todo.id}" >${todo.text}</label>
    <button
        class="item__deleteBtn"
        type="button"
        aria-label="button for deleting to-do list"
    >
        <i class="fa-solid fa-trash" data-id="${todo.id}"></i>
    </button>
  `;

  return item;
}

// Update checkbox status
itemContainer.addEventListener('change', (e) => {
  const id = e.target.id;
  if (!id) return;

  onCheck(id);
  filterInstantRender();
});

function onCheck(id) {
  const checkedItem = document.querySelector(`.item__checkbox[id="${id}"]`);
  const checkedTodo = todos.find((todo) => todo.id === id);

  checkedTodo.status = checkedItem.checked ? 'completed' : 'active';
  saveData('todos', todos);
}

function filterInstantRender() {
  const currentFilter = document.querySelector('.filter__btn.btn--selected')
    ?.dataset.category;
  if (currentFilter !== 'all') {
    hideItems(todos);
    showFilterItems(todos.filter((todo) => todo.status === currentFilter));
  }
}
// Delete todo item
itemContainer.addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  onDelete(e.target, id);

  todos = todos.filter((todo) => todo.id !== id);
  saveData('todos', todos);
});

function onDelete(target, id) {
  const deleteBtn = target.closest('button');
  if (!deleteBtn) return;

  const deletedItem = document.querySelector(`li[data-id="${id}"]`);
  deletedItem.remove();
}

// Filter todo items
filterBtns.addEventListener('click', (e) => {
  const categoryId = e.target.dataset.category;
  if (!categoryId) return;

  handleActiveBtn(e.target);
  onFilter(categoryId);
  saveData('category', categoryId);
});

function onFilter(filter) {
  const filteredTodos =
    filter === 'all' ? todos : todos.filter((todo) => todo.status === filter);

  hideItems(todos);
  showFilterItems(filteredTodos);
}

function hideItems(todos) {
  todos.forEach((todo) => {
    const hideItem = document.querySelector(`li[data-id="${todo.id}"]`);
    hideItem.style.display = 'none';
  });
}

function showFilterItems(todos) {
  todos.forEach((todo) => {
    const visibleItems = document.querySelector(`li[data-id="${todo.id}"]`);
    visibleItems.style.display = 'flex';
  });
}

function handleActiveBtn(target) {
  const activeBtn = document.querySelector('.btn--selected');
  activeBtn.classList.remove('btn--selected');
  target.classList.add('btn--selected');
}

// Dark/light mode toggle
themeBtn.addEventListener('click', (e) => {
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');

  const isDark = document.documentElement.classList.toggle('dark');
  saveData('theme', isDark ? 'dark' : 'light');
});

function getFromStorage(key, fallback) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function renderTodos(todos) {
  todos.forEach((todo) => {
    const item = createItem(todo);
    itemContainer.appendChild(item);
  });
}

function renderCategory() {
  const activeBtn = document.querySelector(
    `.filter__btn[data-category="${category}"]`
  );
  activeBtn.classList.add('btn--selected');

  onFilter(category);
}

function renderTheme() {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
}

// Detect browser default theme and then set it as inital render for dark/light mode
function defaultBrowserTheme() {
  const isDarkMode =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  return isDarkMode ? 'dark' : 'light';
}
