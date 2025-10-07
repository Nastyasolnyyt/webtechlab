// dishes.js
const dishes = [
    {
        keyword: "borsh",
        name: "Борщ",
        price: 195,
        category: "soup",
        count: "350 г",
        image: "photo/borsh.jpg"
    },
    {
        keyword: "mushroom_soup",
        name: "Грибной суп-пюре",
        price: 185,
        category: "soup",
        count: "330 г",
        image: "photo/gribi.png"
    },
    {
        keyword: "cheese_soup",
        name: "Сырный суп",
        price: 270,
        category: "soup",
        count: "330 г",
        image: "photo/chsoup .jpg"
    },
    {
        keyword: "lasagna",
        name: "Лазанья",
        price: 385,
        category: "main",
        count: "400 г",
        image: "photo/lazanya.jpg"
    },
    {
        keyword: "lula_kebab",
        name: "Люля кебаб",
        price: 365,
        category: "main",
        count: "380 г",
        image: "photo/lula.jpg"
    },
    {
        keyword: "cutlets_puree",
        name: "Котлеты с пюре",
        price: 225,
        category: "main",
        count: "350 г",
        image: "photo/purekotl.png"
    },
    {
        keyword: "orange_juice",
        name: "Апельсиновый фреш",
        price: 120,
        category: "drink",
        count: "300 мл",
        image: "photo/applejuce.jpg"
    },
    {
        keyword: "cranberry_juice",
        name: "Клюквенный морс",
        price: 90,
        category: "drink",
        count: "300 мл",
        image: "photo/mangojuce.jpg"
    },
    {
        keyword: "carrot_juice",
        name: "Морковный сок",
        price: 110,
        category: "drink",
        count: "300 мл",
        image: "photo/carjuce.jpg"
    }
];

console.log('Dishes array loaded with', dishes.length, 'items');