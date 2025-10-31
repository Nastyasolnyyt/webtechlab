// orderPage.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Order page initialized');
    initializeOrderPage();
});

async function initializeOrderPage() {
    console.log('🔄 Инициализация страницы заказа...');
    
    // Загружаем блюда с сервера
    try {
        await loadDishes();
        console.log('✅ Блюда загружены с сервера');
    } catch (error) {
        console.error('❌ Ошибка загрузки блюд:', error);
        showErrorMessage('Не удалось загрузить меню');
        return;
    }
    
    // Загружаем сохраненный заказ
    await loadSavedOrder();
    
    // Отображаем состав заказа
    displayOrderItems();
    
    // Обновляем отображение в форме
    updateOrderDisplay();
    
    // Инициализируем обработчик формы
    initializeOrderForm();
    
    console.log('✅ Страница заказа полностью инициализирована');
}

// Загрузить сохраненный заказ
async function loadSavedOrder() {
    console.log('📥 Загрузка заказа из localStorage...');
    
    try {
        // Проверяем доступность storageManager
        if (typeof storageManager === 'undefined') {
            console.error('❌ StorageManager не доступен');
            window.currentOrder = {
                soup: null,
                main: null,
                salad: null,
                drink: null,
                dessert: null
            };
            return;
        }
        
        const savedOrder = storageManager.loadOrder();
        console.log('📋 Сохраненный заказ из localStorage:', savedOrder);
        
        if (!savedOrder) {
            console.log('📭 В localStorage нет сохраненного заказа');
            window.currentOrder = {
                soup: null,
                main: null,
                salad: null,
                drink: null,
                dessert: null
            };
            return;
        }
        
        // Восстанавливаем полные данные блюд
        window.currentOrder = {
            soup: null,
            main: null,
            salad: null,
            drink: null,
            dessert: null
        };
        
        for (const category in savedOrder) {
            const savedDish = savedOrder[category];
            if (!savedDish) continue;
            
            console.log(`🔍 Поиск блюда для категории ${category}:`, savedDish);
            
            // Ищем блюдо по keyword или id
            const dish = dishes.find(d => {
                if (d.keyword === savedDish.keyword) return true;
                if (d.id === savedDish.id) return true;
                return false;
            });
            
            if (dish) {
                window.currentOrder[category] = dish;
                console.log(`✅ Найдено блюдо: ${dish.name} для категории ${category}`);
            } else {
                console.warn(`⚠️ Блюдо не найдено для категории ${category}:`, savedDish);
                window.currentOrder[category] = null;
            }
        }
        
        console.log('🎯 Восстановленный заказ:', window.currentOrder);
        
    } catch (error) {
        console.error('❌ Ошибка загрузки заказа:', error);
        window.currentOrder = {
            soup: null,
            main: null,
            salad: null,
            drink: null,
            dessert: null
        };
    }
}

function displayOrderItems() {
    console.log('🎨 Отображение состава заказа...');
    const container = document.getElementById('order-items-container');
    
    if (!container) {
        console.error('❌ Контейнер для заказа не найден');
        return;
    }
    
    // Проверяем есть ли выбранные блюда
    const hasSelectedDishes = window.currentOrder && 
        Object.values(window.currentOrder).some(dish => dish !== null);
    
    console.log('📊 Есть выбранные блюда:', hasSelectedDishes);
    console.log('📦 Текущий заказ:', window.currentOrder);
    
    if (!hasSelectedDishes) {
        container.innerHTML = `
            <div class="empty-order-message">
                <p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу 
                <a href="lab2.html">Собрать ланч</a>.</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="order-items-grid">';
    let itemCount = 0;
    
    const categories = {
        'soup': 'Суп',
        'main': 'Главное блюдо', 
        'salad': 'Салат',
        'drink': 'Напиток',
        'dessert': 'Десерт'
    };
    
    Object.keys(categories).forEach(category => {
        const dish = window.currentOrder[category];
        if (dish) {
            itemCount++;
            html += `
                <div class="order-dish-card" data-category="${category}">
                    <img src="${dish.image}" alt="${dish.name}" class="order-dish-image" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDRlNGQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iNzk3OTc5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj7QndC+0LzQtdC90LjRgtGMPC90ZXh0Pjwvc3ZnPg=='">
                    <div class="order-dish-info">
                        <p class="order-dish-category">${categories[category]}</p>
                        <p class="order-dish-name">${dish.name}</p>
                        <p class="order-dish-price">${dish.price}₽</p>
                    </div>
                    <button class="remove-button" onclick="removeDishFromOrder('${category}')">Удалить</button>
                </div>
            `;
        }
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    console.log(`✅ Отображено ${itemCount} блюд в заказе`);
}

function removeDishFromOrder(category) {
    console.log(`🗑️ Удаление блюда из категории: ${category}`);
    
    if (window.currentOrder && window.currentOrder[category]) {
        // Удаляем блюдо из заказа
        delete window.currentOrder[category];
        
        // Сохраняем изменения в localStorage
        if (typeof storageManager !== 'undefined') {
            storageManager.saveOrder(window.currentOrder);
            console.log('💾 Изменения сохранены в localStorage');
        }
        
        // Обновляем отображение
        displayOrderItems();
        updateOrderDisplay();
        
        console.log('✅ Блюдо удалено из заказа');
    }
}

function updateOrderDisplay() {
    console.log('🔄 Обновление отображения заказа в форме...');
    
    if (!window.currentOrder) {
        console.log('📭 Заказ не определен');
        return;
    }
    
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
        if (!categoryElement) {
            console.warn(`⚠️ Элемент категории ${category} не найден`);
            return;
        }
        
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
            console.log(`✅ Обновлена категория: ${category} - ${selectedDish.name}`);
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
            console.log(`❌ Категория ${category} - блюдо не выбрано`);
        }
    });
    
    // Обновляем общую стоимость
    const orderTotalElement = document.getElementById('order-total');
    if (orderTotalElement) {
        const totalPriceElement = orderTotalElement.querySelector('.total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = `${totalPrice}₽`;
            orderTotalElement.style.display = 'block';
            console.log('💰 Итоговая стоимость:', totalPrice);
        }
    }
}

function initializeOrderForm() {
    console.log('📝 Инициализация формы заказа...');
    
    const form = document.getElementById('order-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitOrder();
        });
        console.log('✅ Обработчик формы установлен');
    } else {
        console.error('❌ Форма заказа не найдена');
    }
}

async function submitOrder() {
    console.log('🚀 Отправка заказа...');
    
    // Проверяем валидность комбо
    if (!validateOrderCombination()) {
        alert('Состав заказа не соответствует ни одному из доступных комбо. Пожалуйста, проверьте выбранные блюда.');
        return;
    }

    // Собираем данные формы
    const formData = new FormData(document.getElementById('order-form'));
    const orderData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        subscribe: formData.get('subscribe') ? 1 : 0,
        phone: formData.get('phone'),
        delivery_address: formData.get('delivery_address'),
        delivery_type: formData.get('delivery_type'),
        comment: formData.get('comment')
    };

    // Добавляем время доставки только если выбран конкретный время
    if (formData.get('delivery_type') === 'by_time') {
        orderData.delivery_time = formData.get('delivery_time');
    }

    // Добавляем ID блюд (только если блюдо выбрано)
    if (window.currentOrder.soup) orderData.soup_id = window.currentOrder.soup.id;
    if (window.currentOrder.main) orderData.main_course_id = window.currentOrder.main.id;
    if (window.currentOrder.salad) orderData.salad_id = window.currentOrder.salad.id;
    if (window.currentOrder.drink) orderData.drink_id = window.currentOrder.drink.id;
    if (window.currentOrder.dessert) orderData.dessert_id = window.currentOrder.dessert.id;

    console.log('📦 Данные для отправки:', orderData);

    try {

        const API_KEY = '0f1bfb84-07d0-434b-afd5-ee82fb5c1752';
        const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';
        
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        console.log('📨 Ответ сервера:', result);

        if (!response.ok) {
            // Обработка ошибок от сервера
            if (result.error) {
                throw new Error(result.error);
            } else {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
        }

        // УСПЕШНЫЙ ОТВЕТ - сервер вернул созданный заказ
        console.log('✅ Заказ успешно создан:', result);
        
        // Очищаем localStorage после успешного заказа
        if (typeof storageManager !== 'undefined') {
            storageManager.clearOrder();
        }
        
        // Показываем сообщение об успехе
        showSuccessMessage(`Заказ #${result.id} успешно оформлен! Спасибо за ваш заказ.`);
        
        // Через 3 секунды переходим на главную
        setTimeout(() => {
            window.location.href = 'lab2.html';
        }, 3000);
        
    } catch (error) {
        console.error('❌ Ошибка оформления заказа:', error);
        
        // Показываем понятное сообщение об ошибке
        let errorMessage = 'Произошла ошибка при оформлении заказа. ';
        
        if (error.message.includes('API Key')) {
            errorMessage += 'Неверный API ключ. Проверьте ваш ключ авторизации.';
        } else if (error.message.includes('обязательно')) {
            errorMessage += 'Заполните все обязательные поля.';
        } else {
            errorMessage += error.message;
        }
        
        alert(errorMessage);
    }
}

// Функция для показа успешного сообщения
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 20px 30px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        text-align: center;
        font-size: 16px;
    `;
    successDiv.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
        <div>${message}</div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

function validateOrderCombination() {
    if (!window.currentOrder) return false;
    
    const currentOrder = window.currentOrder;
    
    // Проверяем основные блюда
    const hasSoup = !!currentOrder.soup;
    const hasMain = !!currentOrder.main;
    const hasSalad = !!currentOrder.salad;
    const hasDrink = !!currentOrder.drink;
    const hasDessert = !!currentOrder.dessert;
    
    console.log('🔍 Проверка комбо:', { hasSoup, hasMain, hasSalad, hasDrink, hasDessert });
    
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

    const isValid = combo1 || combo2 || combo3 || combo4 || combo5;
    console.log('✅ Валидность комбо:', isValid);
    
    return isValid;
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff6b6b;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}