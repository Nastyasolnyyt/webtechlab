// dishes.js
const dishes = [
    // Супы
    {
        keyword: "borsh",
        name: "Борщ",
        price: 195,
        category: "soup",
        count: "350 г",
        image: "photo/borsh.jpg",
        kind: "meat"
    },
    {
        keyword: "solyanka",
        name: "Солянка",
        price: 235,
        category: "soup",
        count: "350 г",
        image: "photo/solanka.png",
        kind: "meat"
    },
    {
        keyword: "uha_soup",
        name: "Уха",
        price: 370,
        category: "soup",
        count: "330 г",
        image: "photo/uha.png",
        kind: "fish"
    },
    {
        keyword: "sal_soup",
        name: "Суп из лосося",
        price: 370,
        category: "soup",
        count: "330 г",
        image: "photo/fish_soup.jpg",
        kind: "fish"
    },
    {
        keyword: "mushroom_soup",
        name: "Грибной суп-пюре",
        price: 185,
        category: "soup",
        count: "330 г",
        image: "photo/gribi.png",
        kind: "veg"
    },
    {
        keyword: "pump_soup",
        name: "Тыквенный суп-пюре",
        price: 175,
        category: "soup",
        count: "330 г",
        image: "photo/tikva.png",
        kind: "veg"
    },

    // Главные блюда
    {
        keyword: "lula_kebab",
        name: "Люля кебаб",
        price: 365,
        category: "main",
        count: "380 г",
        image: "photo/lula.jpg",
        kind: "meat"
    },
    {
        keyword: "beef_stroganoff",
        name: "Брокколи на пару",
        price: 420,
        category: "main",
        count: "350 г",
        image: "photo/brok.png",
        kind: "veg"
    },
    {
        keyword: "salmon",
        name: "Стейк из лосося",
        price: 325,
        category: "main",
        count: "350 г",
        image: "photo/sal.png",
        kind: "fish"
    },
    {
        keyword: "fish_cutlets",
        name: "Рыбные котлеты",
        price: 280,
        category: "main",
        count: "300 г",
        image: "photo/fish_cutlets.png",
        kind: "fish"
    },
    {
        keyword: "lasagna",
        name: "Лазанья",
        price: 385,
        category: "main",
        count: "400 г",
        image: "photo/lazanya.jpg",
        kind: "meat"
    },
    {
        keyword: "vegetables",
        name: "Тушенные овощи",
        price: 225,
        category: "main",
        count: "350 г",
        image: "photo/veg.png",
        kind: "veg"
    },

    // Салаты
    {
        keyword: "shrimp_salad",
        name: "Салат с креветками",
        price: 320,
        category: "salat",
        count: "250 г",
        image: "photo/shrimp_salad.png",
        kind: "fish"
    },
    {
        keyword: "chicken_salad",
        name: "Салат с курицей",
        price: 280,
        category: "salat",
        count: "280 г",
        image: "photo/chicken_salad.png",
        kind: "meat"
    },
    {
        keyword: "avocado",
        name: "Салат с авокадо",
        price: 170,
        category: "salat",
        count: "250 г",
        image: "photo/avocado.png",
        kind: "veg"
    },
    {
        keyword: "toph_tomato",
        name: "Салат с тофу и помидорами",
        price: 130,
        category: "salat",
        count: "250 г",
        image: "photo/toph_tom.png",
        kind: "veg"
    },
    {
        keyword: "toph_per",
        name: "Салат с тофу и перцем",
        price: 130,
        category: "salat",
        count: "250 г",
        image: "photo/toph_per.png",
        kind: "veg"
    },
    {
        keyword: "salat_tomato_cheese",
        name: "Салат с тофу шпинатом и помидорами",
        price: 140,
        category: "salat",
        count: "250 г",
        image: "photo/toph_tomato_shp.png",
        kind: "veg"
    },

    // Напитки - холодные
    {
        keyword: "orange_juice",
        name: "Апельсиновый фреш",
        price: 120,
        category: "drink",
        count: "300 мл",
        image: "photo/applejuce.jpg",
        kind: "cold"
    },
    {
        keyword: "cranberry_juice",
        name: "Клюквенный морс",
        price: 90,
        category: "drink",
        count: "300 мл",
        image: "photo/mangojuce.jpg",
        kind: "cold"
    },
    {
        keyword: "carrot_juice",
        name: "Морковный сок",
        price: 110,
        category: "drink",
        count: "300 мл",
        image: "photo/carjuce.jpg",
        kind: "cold"
    },

    // Напитки - горячие
    {
        keyword: "black_tea",
        name: "Черный чай",
        price: 80,
        category: "drink",
        count: "300 мл",
        image: "photo/black_tea.jpg",
        kind: "hot"
    },
    {
        keyword: "green_tea",
        name: "Зеленый чай",
        price: 80,
        category: "drink",
        count: "300 мл",
        image: "photo/green_tea.jpg",
        kind: "hot"
    },
    {
        keyword: "coffee_latte",
        name: "Кофе Латте",
        price: 150,
        category: "drink",
        count: "350 мл",
        image: "photo/latte.jpg",
        kind: "hot"
    },

    // Десерты
    {
        keyword: "tiramisu_small",
        name: "Тирамису (маленький)",
        price: 180,
        category: "dessert",
        count: "150 г",
        image: "photo/tiramisu_small.png",
        kind: "small"
    },
    {
        keyword: "cheesecake_small",
        name: "Чизкейк (маленький)",
        price: 160,
        category: "dessert",
        count: "120 г",
        image: "photo/cheescake_small.png",
        kind: "small"
    },
    {
        keyword: "chocolate_cake_small",
        name: "Шоколадный торт (маленький)",
        price: 140,
        category: "dessert",
        count: "130 г",
        image: "photo/chocolate_cake_small.png",
        kind: "small"
    },
    {
        keyword: "tiramisu_medium",
        name: "Тирамису (средний)",
        price: 250,
        category: "dessert",
        count: "220 г",
        image: "photo/tiramisu_medium.png",
        kind: "medium"
    },
    {
        keyword: "cheesecake_medium",
        name: "Чизкейк (средний)",
        price: 220,
        category: "dessert",
        count: "200 г",
        image: "photo/cheesecake_medium.png",
        kind: "medium"
    },
    {
        keyword: "tiramisu_large",
        name: "Тирамису (большой)",
        price: 350,
        category: "dessert",
        count: "350 г",
        image: "photo/tiramisu_large.png",
        kind: "large"
    }
];

console.log('Dishes array loaded with', dishes.length, 'items');