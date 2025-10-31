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
    
    // Загружаем сохраненный заказ при инициализации (если storageManager доступен)
    if (typeof storageManager !== 'undefined') {
        loadSavedOrder().then(() => {
            console.log('✅ Заказ загружен из localStorage');
        }).catch(error => {
            console.error('❌ Ошибка загрузки заказа:', error);
        });
    }
    
    // Добавляем обработчики событий для карточек блюд
    document.addEventListener('click', function(e) {
        const dishCard = e.target.closest('.dish-card');
        if (dishCard) {
            const dishKeyword = dishCard.getAttribute('data-dish');
            console.log('Dish clicked:', dishKeyword);
            addDishToOrder(dishKeyword);
            highlightSelectedDish(dishCard, dishKeyword);
        }
    });
    
    // Обработчик для сброса формы
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('Reset button clicked');
            resetOrder();
        });
    }
}

// Загрузить сохраненный заказ (только если storageManager доступен)
async function loadSavedOrder() {
    if (typeof storageManager === 'undefined') {
        console.log('StorageManager не доступен');
        return;
    }
    
    try {
        const fullOrder = await storageManager.restoreFullOrder();
        if (fullOrder) {
            window.currentOrder = fullOrder;
            console.log('✅ Заказ восстановлен из localStorage');
        }
        
        // Обновляем отображение
        updateOrderDisplay();
        highlightSavedDishes();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки заказа:', error);
    }
}

// Подсветить сохраненные блюда на странице
function highlightSavedDishes() {
    if (!window.currentOrder) return;
    
    // Ждем пока DOM полностью загрузится
    setTimeout(() => {
        Object.keys(window.currentOrder).forEach(category => {
            const dish = window.currentOrder[category];
            if (dish && dish.keyword) {
                const dishCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
                if (dishCard) {
                    dishCard.classList.add('selected');
                    console.log(`✅ Подсвечено блюдо: ${dish.name}`);
                }
            }
        });
    }, 100);
}

function highlightSelectedDish(selectedCard, dishKeyword) {
    const section = selectedCard.closest('section');
    if (!section) return;
    
    const allCardsInSection = section.querySelectorAll('.dish-card');
    allCardsInSection.forEach(card => {
        card.classList.remove('selected');
    });
    selectedCard.classList.add('selected');
}

function addDishToOrder(dishKeyword) {
    // Проверяем, что массив dishes загружен
    if (!dishes || dishes.length === 0) {
        console.error('❌ Массив dishes не загружен');
        return;
    }
    
    const dish = dishes.find(d => d.keyword === dishKeyword);
    if (!dish) {
        console.error('❌ Dish not found:', dishKeyword);
        return;
    }
    
    console.log('✅ Найдено блюдо:', dish.name, 'Категория:', dish.category);
    
    // Определяем категорию блюда с преобразованием серверных названий
    let category;
    switch(dish.category) {
        case 'main-course':
            category = 'main';
            break;
        case 'salad':
            category = 'salad';
            break;
        case 'soup':
            category = 'soup';
            break;
        case 'drink':
            category = 'drink';
            break;
        case 'dessert':
            category = 'dessert';
            break;
        default:
            category = dish.category;
            console.warn('⚠️ Unknown category:', dish.category);
    }
    
    console.log(`🔄 Категория преобразована: ${dish.category} → ${category}`);
    
    // Обновляем заказ
    window.currentOrder[category] = dish;
    
    // Сохраняем в localStorage (если storageManager доступен)
    if (typeof storageManager !== 'undefined') {
        storageManager.saveOrder(window.currentOrder);
        console.log('💾 Заказ сохранен в localStorage');
    }
    
    updateOrderDisplay();
    
    // Обновляем панель оформления (если функция доступна)
    if (typeof updateCheckoutPanel !== 'undefined') {
        updateCheckoutPanel();
    }
}

function updateOrderDisplay() {
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
    let hasAnySelection = false;
    let totalPrice = 0;
    
    // Проверяем, есть ли хотя бы одно выбранное блюдо
    categories.forEach(category => {
        if (window.currentOrder[category]) {
            hasAnySelection = true;
            totalPrice += window.currentOrder[category].price;
        }
    });
    
    const noSelectionMessage = document.querySelector('.no-selection-message');
    
    if (!hasAnySelection) {
        // Если ничего не выбрано
        if (noSelectionMessage) {
            noSelectionMessage.style.display = 'block';
        }
        categories.forEach(category => {
            const element = document.getElementById(`${category}-category`);
            if (element) element.style.display = 'none';
        });
        const orderTotal = document.getElementById('order-total');
        if (orderTotal) orderTotal.style.display = 'none';
        console.log('📭 No selection - hiding categories');
        return;
    }
    
    // Если есть выбранные блюда, скрываем общее сообщение
    if (noSelectionMessage) {
        noSelectionMessage.style.display = 'none';
    }
    
    // Обновляем каждую категорию
    categories.forEach(category => {
        const categoryElement = document.getElementById(`${category}-category`);
        if (!categoryElement) return;
        
        const noSelectionElement = categoryElement.querySelector('.no-selection');
        const selectedDish = window.currentOrder[category];
        
        // Показываем категорию
        categoryElement.style.display = 'block';
        
        if (selectedDish) {
            // Скрываем сообщение "Блюдо не выбрано"
            if (noSelectionElement) {
                noSelectionElement.style.display = 'none';
            }
            
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
            if (noSelectionElement) {
                noSelectionElement.style.display = 'block';
            }
            
            // Скрываем элемент с выбранным блюдом, если он есть
            const selectedElement = categoryElement.querySelector('.selected-dish');
            if (selectedElement) {
                selectedElement.style.display = 'none';
            }
        }
    });
    
    // Обновляем общую стоимость
    const orderTotalElement = document.getElementById('order-total');
    if (orderTotalElement) {
        const totalPriceElement = orderTotalElement.querySelector('.total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = `${totalPrice}₽`;
            orderTotalElement.style.display = 'block';
            console.log('💰 Total price updated:', totalPrice);
        }
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
    
    // Очищаем localStorage (если storageManager доступен)
    if (typeof storageManager !== 'undefined') {
        storageManager.clearOrder();
    }
    
    // Снимаем выделение со всех карточек
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    console.log('🔄 Order reset');
    
    // Обновляем отображение заказа
    updateOrderDisplay();
    
    // Обновляем панель оформления (если функция доступна)
    if (typeof updateCheckoutPanel !== 'undefined') {
        updateCheckoutPanel();
    }
}

function updateFormData() {
    // Эта функция теперь используется только на странице оформления заказа
    // Проверяем существование элементов перед обновлением
    
    const elements = {
        'selected-soup': window.currentOrder.soup ? window.currentOrder.soup.keyword : '',
        'selected-main': window.currentOrder.main ? window.currentOrder.main.keyword : '',
        'selected-salad': window.currentOrder.salad ? window.currentOrder.salad.keyword : '',
        'selected-drink': window.currentOrder.drink ? window.currentOrder.drink.keyword : '',
        'selected-dessert': window.currentOrder.dessert ? window.currentOrder.dessert.keyword : ''
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = elements[id];
        }
    });
    
    const totalPrice = (window.currentOrder.soup?.price || 0) + 
                      (window.currentOrder.main?.price || 0) + 
                      (window.currentOrder.salad?.price || 0) +
                      (window.currentOrder.drink?.price || 0) +
                      (window.currentOrder.dessert?.price || 0);
    
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.value = totalPrice;
    }
    
    console.log('📊 Form data updated for submission');
}

function validateOrderCombination() {
    const currentOrder = window.currentOrder || {};
    
    // Проверяем основные блюда
    const hasSoup = !!currentOrder.soup;
    const hasMain = !!currentOrder.main;
    const hasSalad = !!currentOrder.salad;
    const hasDrink = !!currentOrder.drink;
    const hasDessert = !!currentOrder.dessert;
    
    console.log('🔍 Order validation:', { hasSoup, hasMain, hasSalad, hasDrink, hasDessert });
    
    // Комбо 1: Суп + Главное + Салат + Напиток
    const combo1 = hasSoup && hasMain && hasSalad && hasDrink;
    
    // Комbo 2: Суп + Главное + Напиток
    const combo2 = hasSoup && hasMain && hasDrink;
    
    // Комбо 3: Суп + Салат + Напиток
    const combo3 = hasSoup && hasSalad && hasDrink;
    
    // Комбо 4: Главное + Салат + Напиток
    const combo4 = hasMain && hasSalad && hasDrink;
    
    // Комбо 5: Главное + Напиток
    const combo5 = hasMain && hasDrink;
    
    // Десерт можно добавить к любому комбо
    const hasValidCombo = combo1 || combo2 || combo3 || combo4 || combo5;
    
    console.log('✅ Valid combo found:', hasValidCombo);
    
    return hasValidCombo;
}

// Экспортируем функции для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeOrderManager,
        addDishToOrder,
        resetOrder,
        updateOrderDisplay,
        validateOrderCombination,
        updateFormData
    };
}