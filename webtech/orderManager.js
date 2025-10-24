// orderManager.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Order manager initialized');
    initializeOrderManager();
});

function initializeOrderManager() {
    // Инициализируем состояние заказа
    window.currentOrder = {
        soup: null,
        main: null,
        salad: null,
        drink: null,
        dessert: null
    };
    
    console.log('Current order initialized:', window.currentOrder);
    
    // Добавляем обработчики событий для карточек блюд
    document.addEventListener('click', function(e) {
        // Обрабатываем клик по карточке или кнопке "Добавить"
        const dishCard = e.target.closest('.dish-card');
        if (dishCard) {
            const dishKeyword = dishCard.getAttribute('data-dish');
            console.log('Dish clicked:', dishKeyword);
            addDishToOrder(dishKeyword);
            
            // Добавляем визуальное выделение
            highlightSelectedDish(dishCard, dishKeyword);
        }
    });
    
    // Обработчик для сброса формы
    document.querySelector('.reset-btn').addEventListener('click', function() {
        console.log('Reset button clicked');
        resetOrder();
    });
    
    // Обработчик для отправки формы
    document.getElementById('order-form').addEventListener('submit', function(e) {
        console.log('Form submitted');
        updateFormData();
    });
}

function highlightSelectedDish(selectedCard, dishKeyword) {
    // Находим секцию, к которой принадлежит карточка
    const section = selectedCard.closest('section');
    
    // Снимаем выделение со всех карточек в этой секции
    const allCardsInSection = section.querySelectorAll('.dish-card');
    allCardsInSection.forEach(card => {
        card.classList.remove('selected');
    });
    
    // Добавляем выделение выбранной карточке
    selectedCard.classList.add('selected');
    console.log('Highlighted dish:', dishKeyword);
}

function addDishToOrder(dishKeyword) {
    const dish = dishes.find(d => d.keyword === dishKeyword);
    if (!dish) {
        console.error('Dish not found:', dishKeyword);
        return;
    }
    
    // Определяем категорию блюда с преобразованием серверных названий
    let category;
    switch(dish.category) {
        case 'main-course':
            category = 'main'; // преобразуем main-course в main
            break;
        case 'salad':
            category = 'salad'; // оставляем как есть
            break;
        case 'soup':
            category = 'soup'; // оставляем как есть
            break;
        case 'drink':
            category = 'drink'; // оставляем как есть
            break;
        case 'dessert':
            category = 'dessert'; // оставляем как есть
            break;
        default:
            category = dish.category;
            console.warn('Unknown category:', dish.category);
    }
    
    console.log('Dish category converted:', dish.category, '→', category);
    
    // Обновляем заказ
    window.currentOrder[category] = dish;
    
    console.log('Order updated:', window.currentOrder);
    
    // Обновляем отображение заказа
    updateOrderDisplay();
}

function updateOrderDisplay() {
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
    let hasAnySelection = false;
    let totalPrice = 0;
    
    // Проверяем, есть ли хотя бы одно выбранное блюдо
    categories.forEach(category => {
        if (window.currentOrder[category]) {
            hasAnySelection = true;
        }
    });
    
    const noSelectionMessage = document.querySelector('.no-selection-message');
    
    if (!hasAnySelection) {
        // Если ничего не выбрано
        noSelectionMessage.style.display = 'block';
        categories.forEach(category => {
            document.getElementById(`${category}-category`).style.display = 'none';
        });
        document.getElementById('order-total').style.display = 'none';
        console.log('No selection - hiding categories');
        return;
    }
    
    // Если есть выбранные блюда, скрываем общее сообщение
    noSelectionMessage.style.display = 'none';
    
    // Обновляем каждую категорию
    categories.forEach(category => {
        const categoryElement = document.getElementById(`${category}-category`);
        const noSelectionElement = categoryElement.querySelector('.no-selection');
        const selectedDish = window.currentOrder[category];
        
        // Показываем категорию
        categoryElement.style.display = 'block';
        
        if (selectedDish) {
            totalPrice += selectedDish.price;
            
            // Скрываем сообщение "Блюдо не выбрано"
            noSelectionElement.style.display = 'none';
            
            // Создаем или обновляем отображение выбранного блюда
            let selectedElement = categoryElement.querySelector('.selected-dish');
            if (!selectedElement) {
                selectedElement = document.createElement('div');
                selectedElement.className = 'selected-dish';
                categoryElement.appendChild(selectedElement);
            }
            
            selectedElement.innerHTML = `
                <span class="selected-dish-name">${selectedDish.name}</span>
                <span class="selected-dish-price">${selectedDish.price}₽</span>
            `;
            selectedElement.style.display = 'flex';
        } else {
            // Показываем сообщение "Блюдо не выбрано"
            noSelectionElement.style.display = 'block';
            
            // Скрываем элемент с выбранным блюдом, если он есть
            const selectedElement = categoryElement.querySelector('.selected-dish');
            if (selectedElement) {
                selectedElement.style.display = 'none';
            }
        }
    });
    
    // Обновляем общую стоимость
    const orderTotalElement = document.getElementById('order-total');
    const totalPriceElement = orderTotalElement.querySelector('.total-price');
    
    if (hasAnySelection) {
        totalPriceElement.textContent = `${totalPrice}₽`;
        orderTotalElement.style.display = 'block';
        console.log('Total price updated:', totalPrice);
    }
}

function resetOrder() {
    // Сбрасываем состояние заказа
    window.currentOrder = {
        soup: null,
        main: null,
        salad: null,
        drink: null,
        dessert: null
    };
    
    // Снимаем выделение со всех карточек
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    console.log('Order reset');
    
    // Обновляем отображение заказа
    updateOrderDisplay();
}

function updateFormData() {
    // Обновляем скрытые поля формы перед отправкой
    document.getElementById('selected-soup').value = window.currentOrder.soup ? window.currentOrder.soup.keyword : '';
    document.getElementById('selected-main').value = window.currentOrder.main ? window.currentOrder.main.keyword : '';
    document.getElementById('selected-salad').value = window.currentOrder.salad ? window.currentOrder.salad.keyword : '';
    document.getElementById('selected-drink').value = window.currentOrder.drink ? window.currentOrder.drink.keyword : '';
    document.getElementById('selected-dessert').value = window.currentOrder.dessert ? window.currentOrder.dessert.keyword : '';
    
    const totalPrice = (window.currentOrder.soup?.price || 0) + 
                      (window.currentOrder.main?.price || 0) + 
                      (window.currentOrder.salad?.price || 0) +
                      (window.currentOrder.drink?.price || 0) +
                      (window.currentOrder.dessert?.price || 0);
                      
    document.getElementById('total-price').value = totalPrice;
    
    console.log('Form data updated for submission');
}

function validateOrderCombination() {
    const currentOrder = window.currentOrder || {};
    
    // Проверяем основные блюда
    const hasSoup = !!currentOrder.soup;
    const hasMain = !!currentOrder.main;
    const hasSalad = !!currentOrder.salad;
    const hasDrink = !!currentOrder.drink;
    const hasDessert = !!currentOrder.dessert;
    
    console.log('Order validation:', { hasSoup, hasMain, hasSalad, hasDrink, hasDessert });
    
    // Комбо 1: Суп + Главное + Салат + Напиток
    const combo1 = hasSoup && hasMain && hasSalad && hasDrink;
    
    // Комбо 2: Суп + Главное + Напиток
    const combo2 = hasSoup && hasMain && hasDrink;
    
    // Комбо 3: Суп + Салат + Напиток
    const combo3 = hasSoup && hasSalad && hasDrink;
    
    // Комбо 4: Главное + Салат + Напиток
    const combo4 = hasMain && hasSalad && hasDrink;
    
    // Комбо 5: Главное + Напиток
    const combo5 = hasMain && hasDrink;
    
    // Десерт можно добавить к любому комбо
    const hasValidCombo = combo1 || combo2 || combo3 || combo4 || combo5;
    
    console.log('Valid combo found:', hasValidCombo);
    
    return hasValidCombo;
}