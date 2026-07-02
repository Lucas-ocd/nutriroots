// data.js - Datos iniciales para NutriRoots

const INITIAL_MENU = [
    {
        id: "m1",
        name: "Lunes: Pastel de Calabaza, Espinaca y Queso",
        description: "Suave puré de calabaza gratinado con relleno de espinacas tiernas, ricota y muzzarella light.",
        category: "",
        price: 3100,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 1"
    },
    {
        id: "m2",
        name: "Lunes: Pechuga con Puré de Zanahoria y Brócoli",
        description: "Pechuga de pollo marinada a las hierbas con cremoso puré de zanahorias y arbolitos de brócoli al vapor.",
        category: "",
        price: 3300,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 2"
    },
    {
        id: "m3",
        name: "Martes: Wok de Pollo y Vegetales con Arroz Integral",
        description: "Salteado oriental de pollo, zanahoria, morrón, cebolla y brotes de soja con un toque de salsa de soja baja en sodio.",
        category: "",
        price: 3250,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 1"
    },
    {
        id: "m4",
        name: "Martes: Albóndigas de Lentejas con Salsa Fileto",
        description: "Exquisitas albóndigas vegetarianas de lentejas y avena, cocidas en salsa de tomates naturales y albahaca fresca.",
        category: "",
        price: 2950,
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 2"
    },
    {
        id: "m5",
        name: "Miércoles: Milanesa de Berenjena con Calabazas Asadas",
        description: "Milanesas de berenjena al horno empanadas con avena y semillas, acompañadas de rodajas de calabaza asada.",
        category: "",
        price: 3000,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 1"
    },
    {
        id: "m6",
        name: "Miércoles: Cazuela Rústica de Garbanzos y Vegetales",
        description: "Guiso liviano de garbanzos, zapallo, zanahoria, espinaca y choclo sazonado con pimentón dulce.",
        category: "",
        price: 2900,
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 2"
    },
    {
        id: "m7",
        name: "Jueves: Tarta Integral de Zapallitos y Queso",
        description: "Masa casera con harina integral y semillas, relleno abundante de zapallitos, cebolla caramelizada y queso port salut.",
        category: "",
        price: 3000,
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 1"
    },
    {
        id: "m8",
        name: "Jueves: Suprema Napolitana Light con Puré Rústico",
        description: "Pechuga al horno con salsa de tomate, jamón natural y muzzarella descremada, con puré de papas con cáscara.",
        category: "",
        price: 3400,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 2"
    },
    {
        id: "m9",
        name: "Viernes: Wrap Integral de Pollo, Palta y Vegetales",
        description: "Tortilla integral rellena de tiras de pollo a la plancha, palta, lechuga, tomate y aderezo suave de yogur natural.",
        category: "",
        price: 3200,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 1"
    },
    {
        id: "m10",
        name: "Viernes: Medallones de Quinoa con Calabaza Asada",
        description: "Hamburguesas artesanales de quinoa y vegetales tiernos, acompañadas de rodajas de calabaza al horno con oliva.",
        category: "",
        price: 3100,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Opción 2"
    }
];

const INITIAL_ORDERS = [
    {
        id: "NR-1001",
        customerName: "Sofía Rodríguez",
        phone: "+5491155551234",
        address: "Av. Del Libertador 1420, 4to B",
        deliveryDate: "2026-07-03",
        deliveryTime: "Mediodía (12:00 a 14:00)",
        paymentMethod: "Efectivo",
        items: [
            { id: "m1", name: "Lunes: Pastel de Calabaza, Espinaca y Queso", price: 3100, quantity: 2 },
            { id: "m3", name: "Martes: Wok de Pollo y Vegetales con Arroz Integral", price: 3250, quantity: 1 }
        ],
        subtotal: 9450,
        shipping: 500,
        total: 9950,
        status: "pendiente",
        notes: "Por favor tocar el timbre del departamento directamente.",
        createdAt: "2026-07-02T10:30:00.000Z"
    }
];
