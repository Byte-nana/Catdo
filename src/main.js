'use strict';

// 1. Add ⭕️
// 2. check ⭕️
// 3. delete ⭕️
// 4. filters ⭕️
// 5. darkMode ⭕️
// 6. localStorage

const form = document.querySelector('.footer__form');
const textInput = document.querySelector('#form__input');
const itemContainer = document.querySelector('.main__items');
const filterBtns = document.querySelector('.header__filters');
const themeBtn = document.querySelector('.header__themeBtn');

// Get items from local storage
let todos = getFromStorage('todos', []);
let category = getFromStorage('category', 'all');
let theme = getFromStorage('theme', defaultTheme());

saveData('todos', todos);
saveData('category', category);
saveData('theme', theme);

renderTodos(todos);
renderCategory();

// let todos = [
//   { id: crypto.randomUUID(), text: 'Finish to-do list', status: 'completed' },
//   {
//     id: crypto.randomUUID(),
//     text: 'Post LinkedIn of to-do list',
//     status: 'active',
//   },
// ];

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
  saveData('todos', todos);

  const item = createItem(newTodo);
  itemContainer.appendChild(item);
  item.scrollIntoView({ behavior: 'smooth' });
  textInput.value = '';
  textInput.focus();
});

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

// 2. Check
itemContainer.addEventListener('change', (e) => {
  const id = e.target.id;
  if (!id) return;
  const checkedItem = document.querySelector(`.item__checkbox[id="${id}"]`);

  const checkedTodo = todos.find((todo) => todo.id === id);
  checkedTodo.status = checkedItem.checked ? 'completed' : 'active';
  saveData('todos', todos);

  // re-render
  const currentFilter = document.querySelector('.filter__btn.btn--selected')
    ?.dataset.category;
  if (currentFilter !== 'all') {
    hideItems(todos);
    showFilterItems(todos.filter((todo) => todo.status === currentFilter));
  }
});

// 3. delete
itemContainer.addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  const deleteBtn = e.target.closest('button');
  if (!deleteBtn) return;

  const deletedItem = document.querySelector(`li[data-id="${id}"]`);
  deletedItem.remove();

  todos = todos.filter((todo) => todo.id !== id);
});

// 4. filters
filterBtns.addEventListener('click', (e) => {
  const categoryId = e.target.dataset.category;
  if (!categoryId) return;

  handleActiveBtn(e.target);

  const filteredTodos =
    categoryId === 'all'
      ? todos
      : todos.filter((todo) => todo.status === categoryId);
  hideItems(todos);

  showFilterItems(filteredTodos);
  //   saveData('status', category);
});

function showFilterItems(todos) {
  todos.forEach((todo) => {
    const visibleItems = document.querySelector(`li[data-id="${todo.id}"]`);
    visibleItems.style.display = 'flex';
  });
}

function hideItems(todos) {
  todos.forEach((todo) => {
    const hideItem = document.querySelector(`li[data-id="${todo.id}"]`);
    hideItem.style.display = 'none';
  });
}

function handleActiveBtn(target) {
  const activeBtn = document.querySelector('.btn--selected');
  activeBtn.classList.remove('btn--selected');
  target.classList.add('btn--selected');
}

// 5. dark mode
themeBtn.addEventListener('click', (e) => {
  const icon = themeBtn.querySelector('.fa-solid');
  if (icon.matches('.fa-moon')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }

  const isDark = document.documentElement.classList.toggle('dark');

  //   saveData('theme', isDark ? 'dark' : 'light');
});

// 6. LocalStorage
function getFromStorage(key, fallback) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

// save Data
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// render todos
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
}
// updateData

// detect browser theme
function defaultTheme() {
  const isDarkMode =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  return isDarkMode ? 'dark' : 'light';
}
