// displayDishes.js
document.addEventListener('DOMContentLoaded', function() {
    // ВМЕСТО: displayDishes();
    // СТАЛО: 
    loadDishes().then(() => {
        displayDishes();
        initializeFilters();
    }).catch(error => {
        console.error('Не удалось загрузить меню:', error);
        // Можно показать fallback данные или сообщение об ошибке
    });
});

// ВСЁ ОСТАЛЬНОЕ БЕЗ ИЗМЕНЕНИЙ!
function displayDishes() {
    // Сортируем блюда по алфавиту
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям
    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === 'soup'),
        main: sortedDishes.filter(dish => dish.category === 'main'),
        salat: sortedDishes.filter(dish => dish.category === 'salat'),
        drink: sortedDishes.filter(dish => dish.category === 'drink'),
        dessert: sortedDishes.filter(dish => dish.category === 'dessert')
    };
    
    // Отображаем блюда для каждой категории
    displayCategoryWithFilters('soup', 'Выберите суп', dishesByCategory.soup, [
        { name: 'рыбный', kind: 'fish' },
        { name: 'мясной', kind: 'meat' },
        { name: 'вегетарианский', kind: 'veg' }
    ]);
    
    displayCategoryWithFilters('main', 'Выберите главное блюдо', dishesByCategory.main, [
        { name: 'рыбное', kind: 'fish' },
        { name: 'мясное', kind: 'meat' },
        { name: 'вегетарианское', kind: 'veg' }
    ]);
    
    displayCategoryWithFilters('salat', 'Салаты и стартеры', dishesByCategory.salat, [
        { name: 'рыбный', kind: 'fish' },
        { name: 'мясной', kind: 'meat' },
        { name: 'вегетарианский', kind: 'veg' }
    ]);
    
    displayCategoryWithFilters('drink', 'Выберите напиток', dishesByCategory.drink, [
        { name: 'холодный', kind: 'cold' },
        { name: 'горячий', kind: 'hot' }
    ]);
    
    displayCategoryWithFilters('dessert', 'Выберите десерт', dishesByCategory.dessert, [
        { name: 'маленькая порция', kind: 'small' },
        { name: 'средняя порция', kind: 'medium' },
        { name: 'большая порция', kind: 'large' }
    ]);
}

// Остальные функции БЕЗ ИЗМЕНЕНИЙ...

function displayCategoryWithFilters(category, title, dishes, filters) {
    const mainElement = document.querySelector('main');
    
    if (!mainElement) {
        console.error('Main element not found');
        return;
    }
    
    // Создаем секцию
    const section = document.createElement('section');
    section.id = `${category}-section`;
    
    // Создаем заголовок
    const heading = document.createElement('h2');
    heading.textContent = title;
    section.appendChild(heading);
    
    // Создаем блок фильтров
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters';
    filtersContainer.innerHTML = '<span>Фильтры:</span>';
    
    filters.forEach(filter => {
        const filterButton = document.createElement('button');
        filterButton.className = 'filter-btn';
        filterButton.setAttribute('data-kind', filter.kind);
        filterButton.setAttribute('data-category', category);
        filterButton.textContent = filter.name;
        filtersContainer.appendChild(filterButton);
    });
    
    section.appendChild(filtersContainer);
    
    // Создаем контейнер для карточек
    const grid = document.createElement('div');
    grid.className = 'dishes-grid';
    grid.id = `${category}-grid`;
    
    // Блюда уже отсортированы, просто создаем карточки
    dishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        grid.appendChild(dishCard);
    });
    
    section.appendChild(grid);
    mainElement.appendChild(section);
    
    console.log(`Displayed ${dishes.length} ${category} dishes with ${filters.length} filters`);
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
    card.setAttribute('data-kind', dish.kind);
    
    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" class="dish-image">
        <p class="dish-price">${dish.price}₽</p>
        <p class="dish-name">${dish.name}</p>
        <p class="dish-weight">${dish.count}</p>
        <button class="add-button">Добавить</button>
    `;
    
    return card;
}

function initializeFilters() {
    // Добавляем обработчики для фильтров
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            const filterBtn = e.target;
            const kind = filterBtn.getAttribute('data-kind');
            const category = filterBtn.getAttribute('data-category');
            
            toggleFilter(filterBtn, kind, category);
        }
    });
}

function toggleFilter(filterBtn, kind, category) {
    const grid = document.getElementById(`${category}-grid`);
    const allFilterBtns = document.querySelectorAll(`[data-category="${category}"]`);
    const allDishes = grid.querySelectorAll('.dish-card');
    
    // Если фильтр уже активен - снимаем фильтр
    if (filterBtn.classList.contains('active')) {
        filterBtn.classList.remove('active');
        // Показываем все блюда (они остаются отсортированными)
        allDishes.forEach(dish => {
            dish.style.display = 'block';
        });
    } else {
        // Снимаем активный класс со всех фильтров этой категории
        allFilterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс к выбранному фильтру
        filterBtn.classList.add('active');
        
        // Фильтруем блюда (отфильтрованные блюда остаются в алфавитном порядке)
        allDishes.forEach(dish => {
            if (dish.getAttribute('data-kind') === kind) {
                dish.style.display = 'block';
            } else {
                dish.style.display = 'none';
            }
        });
    }
}