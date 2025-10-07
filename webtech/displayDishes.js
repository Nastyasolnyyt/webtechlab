// displayDishes.js
document.addEventListener('DOMContentLoaded', function() {
    displayDishes();
});

function displayDishes() {
    // Сортируем блюда по алфавиту
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям
    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === 'soup'),
        main: sortedDishes.filter(dish => dish.category === 'main'),
        drink: sortedDishes.filter(dish => dish.category === 'drink')
    };
    
    // Отображаем блюда для каждой категории
    displayCategoryDishes('soup', 'Выберите суп', dishesByCategory.soup);
    displayCategoryDishes('main', 'Выберите главное блюдо', dishesByCategory.main);
    displayCategoryDishes('drink', 'Выберите напиток', dishesByCategory.drink);
}

function displayCategoryDishes(category, title, dishes) {
    const mainElement = document.querySelector('main');
    
    // Создаем секцию
    const section = document.createElement('section');
    
    // Создаем заголовок
    const heading = document.createElement('h2');
    heading.textContent = title;
    section.appendChild(heading);
    
    // Создаем контейнер для карточек
    const grid = document.createElement('div');
    grid.className = 'dishes-grid';
    
    // Создаем карточки для каждого блюда
    dishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        grid.appendChild(dishCard);
    });
    
    section.appendChild(grid);
    mainElement.appendChild(section);
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
    
    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" class="dish-image">
        <p class="dish-price">${dish.price}₽</p>
        <p class="dish-name">${dish.name}</p>
        <p class="dish-weight">${dish.count}</p>
        <button class="add-button">Добавить</button>
    `;
    
    return card;
}