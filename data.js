// data.js - Datos iniciales para NutriRoots Clásico y Corporativo

const INITIAL_MENU_RETAIL = [
    {
        id: "m1",
        name: "Pastel de Calabaza, Espinaca y Queso",
        description: "Suave puré de calabaza gratinado con relleno de espinacas tiernas, ricota y muzzarella light.",
        category: "",
        price: 3100,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 1"
    },
    {
        id: "m2",
        name: "Pechuga con Puré de Zanahoria y Brócoli",
        description: "Pechuga de pollo marinada a las hierbas con cremoso puré de zanahorias y arbolitos de brócoli al vapor.",
        category: "",
        price: 3300,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 2"
    },
    {
        id: "m3",
        name: "Wok de Pollo y Vegetales con Arroz Integral",
        description: "Salteado oriental de pollo, zanahoria, morrón, cebolla y brotes de soja con un toque de salsa de soja baja en sodio.",
        category: "",
        price: 3250,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 3"
    },
    {
        id: "m4",
        name: "Albóndigas de Lentejas con Salsa Fileto",
        description: "Exquisitas albóndigas vegetarianas de lentejas y avena, cocidas en salsa de tomates naturales y albahaca fresca.",
        category: "",
        price: 2950,
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 4"
    },
    {
        id: "m5",
        name: "Milanesa de Berenjena con Calabazas Asadas",
        description: "Milanesas de berenjena al horno empanadas con avena y semillas, acompañadas de rodajas de calabaza asada.",
        category: "",
        price: 3000,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 5"
    },
    {
        id: "m6",
        name: "Cazuela Rústica de Garbanzos y Vegetales",
        description: "Guiso liviano de garbanzos, zapallo, zanahoria, espinaca y choclo sazonado con pimentón dulce.",
        category: "",
        price: 2900,
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 6"
    },
    {
        id: "m7",
        name: "Tarta Integral de Zapallitos y Queso",
        description: "Masa casera con harina integral y semillas, relleno abundante de zapallitos, cebolla caramelizada y queso port salut.",
        category: "",
        price: 3000,
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 7"
    },
    {
        id: "m8",
        name: "Suprema Napolitana Light con Puré Rústico",
        description: "Pechuga al horno con salsa de tomate, jamón natural y muzzarella descremada, con puré de papas con cáscara.",
        category: "",
        price: 3400,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 8"
    },
    {
        id: "m9",
        name: "Wrap Integral de Pollo, Palta y Vegetales",
        description: "Tortilla integral rellena de tiras de pollo a la plancha, palta, lechuga, tomate y aderezo suave de yogur natural.",
        category: "",
        price: 3200,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 9"
    },
    {
        id: "m10",
        name: "Medallones de Quinoa con Calabaza Asada",
        description: "Hamburguesas artesanales de quinoa y vegetales tiernos, acompañadas de rodajas de calabaza al horno con oliva.",
        category: "",
        price: 3100,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 10"
    }
];

const INITIAL_ORDERS_RETAIL = [
    {
        id: "NR-1001",
        customerName: "Sofía Rodríguez",
        phone: "+5491155551234",
        address: "Av. Del Libertador 1420, 4to B",
        deliveryDate: "2026-07-06",
        deliveryTime: "Mediodía (12:00 a 14:00)",
        paymentMethod: "Efectivo",
        items: [
            { id: "m1", name: "Pastel de Calabaza, Espinaca y Queso", price: 3100, quantity: 2 },
            { id: "m3", name: "Wok de Pollo y Vegetales con Arroz Integral", price: 3250, quantity: 1 }
        ],
        subtotal: 9450,
        shipping: 500,
        total: 9950,
        status: "pendiente",
        notes: "Por favor tocar el timbre del departamento directamente.",
        createdAt: "2026-07-02T10:30:00.000Z"
    }
];

const INITIAL_MENU_CORP = [
    {
        id: "mc1",
        name: "Suprema Rellena de Espinaca y Queso",
        description: "Pechuga rellena con espinaca a la crema y muzzarella fundida, acompañada de puré de calabaza suave.",
        category: "",
        price: 4200,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 1"
    },
    {
        id: "mc2",
        name: "Wrap Premium: Lomo Fileteado y Vegetales Asados",
        description: "Tiras de lomo a la plancha, cebolla morada, morrón y berenjenas asadas en un wrap integral gigante con salsa de hierbas.",
        category: "",
        price: 3900,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 2"
    },
    {
        id: "mc3",
        name: "Ensalada Gourmet Caesar con Pollo y Palmitos",
        description: "Mix de lechugas, pechuga de pollo marinada, palmitos tiernos, croutons integrales, hebras de parmesano y aderezo caesar casero.",
        category: "",
        price: 3800,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 3"
    },
    {
        id: "mc4",
        name: "Wok Asiático de Salmón y Fideos de Arroz",
        description: "Fideos de arroz salteados con dados de salmón fresco, brócoli, chauchas, zanahoria y aderezo especial de soja y sésamo.",
        category: "",
        price: 4800,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 4"
    },
    {
        id: "mc5",
        name: "Tarta Rústica de Salmón y Puerro Integral",
        description: "Masa integral crujiente con abundante relleno de salmón rosado desmenuzado, puerros salteados y crema light.",
        category: "",
        price: 4100,
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 5"
    },
    {
        id: "mc6",
        name: "Risotto Cremoso de Hongos Portobello",
        description: "Arroz arborio cocido con caldo casero, champiñones, hongos portobello frescos y un toque de queso parmesano italiano.",
        category: "",
        price: 4400,
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 6"
    },
    {
        id: "mc7",
        name: "Pechuga a la Mostaza con Batatas al Romero",
        description: "Suprema de pollo bañada en salsa suave de mostaza y miel de campo, con cubos de batatas horneadas al romero.",
        category: "",
        price: 4200,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 7"
    },
    {
        id: "mc8",
        name: "Sorrentinos Veganos de Calabaza al Verdeo",
        description: "Pasta rellena artesanal de puré de calabaza asada con salsa fileto natural o crema de coco al verdeo.",
        category: "",
        price: 4300,
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 8"
    },
    {
        id: "mc9",
        name: "Wrap Veggie: Tofu Crujiente, Palta y Hummus",
        description: "Bastones de tofu marinados y salteados, palta, zanahoria rallada, tomate y aderezo de hummus artesanal.",
        category: "",
        price: 3750,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 9"
    },
    {
        id: "mc10",
        name: "Medallones de Lentejas y Hongos con Puré al Pesto",
        description: "Hamburguesas caseras de lentejas y champiñones al horno, acompañadas de puré de papas con toque de pesto de albahaca.",
        category: "",
        price: 3950,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        available: true,
        tag: "Menú 10"
    }
];

const INITIAL_ORDERS_CORP = [
    {
        id: "NC-1001",
        customerName: "Estudio Contable & Asociados",
        phone: "+5491122223333",
        address: "Av. Corrientes 1250, Piso 8",
        deliveryDate: "2026-07-06",
        deliveryTime: "Mediodía (12:00 a 14:00)",
        paymentMethod: "Transferencia",
        items: [
            { id: "mc1", name: "Menú Ejecutivo: Suprema Rellena", price: 4200, quantity: 5 },
            { id: "mc3", name: "Ensalada Gourmet Caesar con Pollo", price: 3800, quantity: 5 }
        ],
        subtotal: 40000,
        shipping: 0, // >10 viandas
        total: 40000,
        status: "pendiente",
        notes: "Dejar en recepción del piso 8. Factura A requerida.",
        createdAt: "2026-07-03T11:00:00.000Z"
    }
];
