// storageManager.js
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'foodConstructOrder';
    }

    // Сохранить заказ в localStorage
    saveOrder(order) {
        try {
            // Сохраняем только идентификаторы блюд
            const orderToSave = {};
            Object.keys(order).forEach(category => {
                if (order[category]) {
                    orderToSave[category] = {
                        keyword: order[category].keyword,
                        id: order[category].id,
                        name: order[category].name // Добавляем имя для отладки
                    };
                }
            });
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orderToSave));
            console.log('✅ Заказ сохранен в localStorage:', orderToSave);
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения заказа:', error);
            return false;
        }
    }

    // Загрузить заказ из localStorage
    loadOrder() {
        try {
            const savedOrder = localStorage.getItem(this.STORAGE_KEY);
            if (!savedOrder) return null;
            
            const orderData = JSON.parse(savedOrder);
            console.log('📥 Загружен заказ из localStorage:', orderData);
            return orderData;
        } catch (error) {
            console.error('❌ Ошибка загрузки заказа:', error);
            return null;
        }
    }

    // Очистить весь заказ
    clearOrder() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('🧹 Весь заказ очищен из localStorage');
    }

    // Проверить есть ли сохраненный заказ
    hasOrder() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }
}

// Создаем глобальный экземпляр
const storageManager = new StorageManager();