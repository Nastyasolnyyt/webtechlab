// dishes.js

let dishes = [];
async function loadDishes() {
    try {
        // URL API 
        const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
        
        // запрос к серверу
        const response = await fetch(apiUrl);
        
        // Проверяем успешность запроса
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        // Получаем данные в формате JSON
        const data = await response.json();
        
        // Сохраняем данные в глобальную переменную dishes
        dishes = data;
        
        console.log('Данные успешно загружены с сервера');
        return data;
        
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        throw error;
    }
}
console.log('Dishes array loaded with', dishes.length, 'items');