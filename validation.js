// validation.js
document.addEventListener('DOMContentLoaded', function() {
    initializeValidation();
});

function initializeValidation() {
    const orderForm = document.getElementById('order-form');
    
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isValid = validateOrder();
        
        if (isValid) {
            // Если заказ валиден, отправляем форму
            console.log('Order is valid, submitting...');
            this.submit();
        }
        // Если не валиден - показываем уведомление (уже сделано в validateOrder)
    });
}

function validateOrder() {
    const currentOrder = window.currentOrder || {};
    
    // Проверяем, что есть хотя бы одно блюдо
    const hasAnyDish = currentOrder.soup || currentOrder.main || currentOrder.salad || currentOrder.drink || currentOrder.dessert;
    
    if (!hasAnyDish) {
        showNotification('Ничего не выбрано. Выберите блюда для заказа');
        return false;
    }
    
    // Проверяем комбинации блюд
    
    // Комбо 1: Суп + Главное + Салат + Напиток
    const combo1 = currentOrder.soup && currentOrder.main && currentOrder.salad && currentOrder.drink;
    
    // Комбо 2: Суп + Главное + Напиток
    const combo2 = currentOrder.soup && currentOrder.main && currentOrder.drink;
    
    // Комбо 3: Суп + Салат + Напиток
    const combo3 = currentOrder.soup && currentOrder.salad && currentOrder.drink;
    
    // Комбо 4: Главное + Салат + Напиток
    const combo4 = currentOrder.main && currentOrder.salad && currentOrder.drink;
    
    // Комбо 5: Главное + Напиток
    const combo5 = currentOrder.main && currentOrder.drink;
    
    // Десерт можно добавить к любому комбо
    const hasValidCombo = combo1 || combo2 || combo3 || combo4 || combo5;
    
    if (!hasValidCombo) {
        // Определяем какое уведомление показать
        if (currentOrder.soup && !currentOrder.main && !currentOrder.salad && !currentOrder.drink) {
            showNotification('Выберите главное блюдо/салат/стартер');
        }
        else if ((currentOrder.soup && (currentOrder.main || currentOrder.salad) && !currentOrder.drink) || (currentOrder.soup && currentOrder.main && !currentOrder.drink) || (currentOrder.soup && currentOrder.salad && !currentOrder.drink) || (currentOrder.main && currentOrder.salad && !currentOrder.drink) || (currentOrder.main && !currentOrder.drink)){
            showNotification('Выберите напиток');
        }
        else if (currentOrder.salad && !currentOrder.soup && !currentOrder.main && !currentOrder.drink) {
            showNotification('Выберите суп или главное блюдо');
        }
        else if ((currentOrder.drink || currentOrder.dessert) && !currentOrder.main && !currentOrder.soup && !currentOrder.salad) {
            showNotification('Выберите главное блюдо');
        }
        
        else {
            showNotification('Выберите суп или главное блюдо');
        }
        return false;
    }
    
    return true;
}

function showNotification(message) {
    // Удаляем существующие уведомления
    const existingNotification = document.querySelector('.notification-overlay');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем overlay
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
        <h3>Внимание</h3>
        <p>${message}</p>
        <button class="notification-btn">Окей</button>
    `;
    
    overlay.appendChild(notification);
    document.body.appendChild(overlay);
    
    // Добавляем обработчик для кнопки
    const okButton = notification.querySelector('.notification-btn');
    okButton.addEventListener('click', function() {
        overlay.remove();
    });
    
    // Закрытие по клику на overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}