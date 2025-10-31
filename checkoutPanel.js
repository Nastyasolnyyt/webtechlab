// checkoutPanel.js
class CheckoutPanel {
    constructor() {
        this.panel = null;
        this.init();
    }

    init() {
        this.createPanel();
        this.updatePanel();
    }

    createPanel() {
        // Создаем панель
        this.panel = document.createElement('div');
        this.panel.className = 'checkout-panel';
        this.panel.style.cssText = `
            position: sticky;
            bottom: 0;
            background: white;
            padding: 20px;
            border-top: 2px solid #556B2F;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            z-index: 100;
            display: none;
        `;

        this.panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto;">
                <div>
                    <strong style="font-size: 1.2rem;">Стоимость заказа: <span id="checkout-total">0₽</span></strong>
                </div>
                <div>
                    <a href="order.html" id="checkout-link" class="checkout-button" style="
                        background: #556B2F;
                        color: white;
                        padding: 12px 24px;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: bold;
                        pointer-events: none;
                        opacity: 0.6;
                    ">Перейти к оформлению</a>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
    }

    updatePanel() {
        if (!window.currentOrder) return;

        const totalPrice = this.calculateTotalPrice();
        const isValidCombo = this.validateOrderCombination();
        
        const totalElement = document.getElementById('checkout-total');
        const linkElement = document.getElementById('checkout-link');
        
        if (totalElement) {
            totalElement.textContent = `${totalPrice}₽`;
        }
        
        if (linkElement) {
            if (isValidCombo && totalPrice > 0) {
                linkElement.style.pointerEvents = 'auto';
                linkElement.style.opacity = '1';
            } else {
                linkElement.style.pointerEvents = 'none';
                linkElement.style.opacity = '0.6';
            }
        }
        
        // Показываем/скрываем панель
        if (totalPrice > 0) {
            this.panel.style.display = 'block';
        } else {
            this.panel.style.display = 'none';
        }
    }

    calculateTotalPrice() {
        if (!window.currentOrder) return 0;
        
        return Object.values(window.currentOrder).reduce((total, dish) => {
            return total + (dish ? dish.price : 0);
        }, 0);
    }

    validateOrderCombination() {
        const currentOrder = window.currentOrder || {};
        
        const hasSoup = !!currentOrder.soup;
        const hasMain = !!currentOrder.main;
        const hasSalad = !!currentOrder.salad;
        const hasDrink = !!currentOrder.drink;
        const hasDessert = !!currentOrder.dessert;

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

        return combo1 || combo2 || combo3 || combo4 || combo5;
    }
}

// Инициализируем панель
let checkoutPanel;

document.addEventListener('DOMContentLoaded', function() {
    checkoutPanel = new CheckoutPanel();
});

// Функция для обновления панели из других скриптов
function updateCheckoutPanel() {
    if (checkoutPanel) {
        checkoutPanel.updatePanel();
    }
}