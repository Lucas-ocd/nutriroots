// app.js - Lógica y gestión de estado de NutriRoots

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCHxqIi9eNN04OztdWnlZZgTKOhZCcVmmk",
    authDomain: "nutriroots-f80fc.firebaseapp.com",
    projectId: "nutriroots-f80fc",
    storageBucket: "nutriroots-f80fc.firebasestorage.app",
    messagingSenderId: "30226400776",
    appId: "1:30226400776:web:1b1dd2255fd012dbcff3bd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Mapa de iconos SVG profesionales para la interfaz
const APP_ICONS = {
    edit: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    delete: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    whatsapp: `<svg class="svg-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.176 8.176 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.44 0-2.86-.38-4.11-1.11l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.42c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z"/></svg>`,
    company: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: -2px; margin-right: 0.25rem;"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/><line x1="8" y1="6" x2="8.01" y2="6"/><line x1="12" y1="6" x2="12.01" y2="6"/><line x1="16" y1="6" x2="16.01" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/></svg>`,
    user: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: -2px; margin-right: 0.25rem;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    package: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; vertical-align: -3px; margin-right: 0.4rem;"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    emptyCart: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width: 52px; height: 52px; color: var(--gray-400); margin: 0 auto 0.8rem auto; display: block;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    truck: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; vertical-align: -2px; margin-right: 0.3rem;"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    checkCircle: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; vertical-align: -2px; margin-right: 0.3rem; color: var(--green-success);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
};

// Configuración de Zonas de Entrega y Localidades en Buenos Aires para NutriRoots
const DELIVERY_ZONES_CONFIG = [
    // --- LOCALIDADES INDIVIDUALES DE GBA ZONA OESTE ---
    {
        id: "ituzaingo",
        category: "gba-oeste",
        parentGroup: "gba-oeste",
        name: "Ituzaingó (Sede Central Zárate 3171)",
        shortName: "Ituzaingó",
        price: 2500,
        badge: "Cocina Central · Tarifa Vecina",
        schedule: "Lunes a Viernes (10:00 a 14:00 / 18:00 a 20:30 hs)",
        description: "Envío preferencial y más rápido desde nuestra sede en Zárate 3171 hacia todo Ituzaingó Norte y Sur, Parque Leloir y Villa Udaondo.",
        neighborhoods: ["Ituzaingó Centro", "Parque Leloir", "Villa Udaondo", "Ituzaingó Sur", "San Alberto"]
    },
    {
        id: "castelar",
        category: "gba-oeste",
        parentGroup: "gba-oeste",
        name: "Castelar",
        shortName: "Castelar",
        price: 3000,
        badge: "Zona Inmediata",
        schedule: "Lunes a Viernes (10:00 a 14:00 / 18:00 a 20:30 hs)",
        description: "Reparto diario ágil en Castelar Norte, Castelar Centro y Castelar Sur.",
        neighborhoods: ["Castelar Norte", "Castelar Centro", "Castelar Sur", "Barrio Seré"]
    },
    {
        id: "moron-haedo",
        category: "gba-oeste",
        parentGroup: "gba-oeste",
        name: "Morón & Haedo",
        shortName: "Morón / Haedo",
        price: 3500,
        badge: "Zona Oeste Centro",
        schedule: "Lunes, Miércoles y Viernes (10:00 a 14:00 / 18:00 a 21:00 hs)",
        description: "Entregas programadas en Morón Centro, Morón Sur, Haedo Norte y Haedo Sur con cadena de frío.",
        neighborhoods: ["Morón Centro", "Morón Sur", "Haedo", "Villa Sarmiento", "El Palomar Sur"]
    },
    {
        id: "hurlingham",
        category: "gba-oeste",
        parentGroup: "gba-oeste",
        name: "Hurlingham & Villa Tesei",
        shortName: "Hurlingham",
        price: 3500,
        badge: "Zona Oeste Norte",
        schedule: "Martes y Jueves (10:00 a 14:00 / 18:00 a 21:00 hs)",
        description: "Despacho directo hacia Hurlingham, Villa Tesei y William Morris.",
        neighborhoods: ["Hurlingham Centro", "Villa Tesei", "William Morris"]
    },
    {
        id: "tres-de-febrero",
        category: "gba-oeste",
        parentGroup: "gba-oeste",
        name: "Tres de Febrero (Caseros / El Palomar)",
        shortName: "3 de Febrero",
        price: 4000,
        badge: "Zona Oeste Noreste",
        schedule: "Martes y Jueves (10:00 a 14:00 / 18:00 a 21:00 hs)",
        description: "Entregas en Caseros, Ciudad Jardín, Santos Lugares, El Palomar y Sáenz Peña.",
        neighborhoods: ["Caseros", "Ciudad Jardín Lomas del Palomar", "El Palomar", "Santos Lugares", "Sáenz Peña", "Martín Coronado"]
    },
    {
        id: "la-matanza-norte",
        category: "gba-oeste",
        parentGroup: "gba-oeste",
        name: "Ramos Mejía & San Justo",
        shortName: "Ramos / San Justo",
        price: 4000,
        badge: "Zona Oeste Sur",
        schedule: "Miércoles y Viernes (10:00 a 14:00 / 18:00 a 21:00 hs)",
        description: "Cobertura completa en Ramos Mejía, San Justo, Villa Luzuriaga y Lomas del Mirador.",
        neighborhoods: ["Ramos Mejía", "San Justo", "Villa Luzuriaga", "Lomas del Mirador", "Ciudadela"]
    },

    // --- SECTORES DE CABA ---
    {
        id: "caba-oeste",
        category: "caba",
        parentGroup: "caba",
        name: "CABA Oeste (Devoto, Flores, Liniers)",
        shortName: "CABA Oeste",
        price: 7000,
        badge: "Acceso Rápido por Autopista",
        schedule: "Domingo (18:00 a 21:00 hs) y Lunes (10:00 a 14:00 / 18:00 a 21:00 hs)",
        description: "Acceso inmediato por Autopista del Oeste hacia barrios del oeste de la Capital Federal.",
        neighborhoods: ["Villa Devoto", "Villa del Parque", "Villa Real", "Versalles", "Liniers", "Mataderos", "Flores", "Floresta", "Monte Castro", "Vélez Sársfield", "Parque Avellaneda"]
    },
    {
        id: "caba-norte",
        category: "caba",
        parentGroup: "caba",
        name: "CABA Norte (Palermo, Belgrano, Núñez)",
        shortName: "CABA Norte",
        price: 7500,
        badge: "Corredor Norte",
        schedule: "Domingo (18:00 a 21:00 hs) y Lunes (10:00 a 14:00 / 18:00 a 21:00 hs)",
        description: "Entregas programadas en los barrios residenciales del norte de CABA.",
        neighborhoods: ["Palermo", "Belgrano", "Núñez", "Colegiales", "Saavedra", "Coghlan", "Chacarita", "Villa Urquiza", "Villa Pueyrredón"]
    },
    {
        id: "caba-centro",
        category: "caba",
        parentGroup: "caba",
        name: "CABA Centro & Este (Caballito, Recoleta, Retiro)",
        shortName: "CABA Centro",
        price: 8000,
        badge: "Centro & Puerto",
        schedule: "Domingo (18:00 a 21:00 hs) y Lunes (10:00 a 14:00 / 18:00 a 21:00 hs)",
        description: "Despacho central hacia Caballito, Almagro, Recoleta, Retiro, San Nicolás y Puerto Madero.",
        neighborhoods: ["Caballito", "Almagro", "Recoleta", "Retiro", "Puerto Madero", "San Nicolás", "Monserrat", "San Telmo", "Balvanera", "San Cristóbal", "Boedo"]
    },

    // --- MACRO-ZONAS (Compatibilidad histórica y vistas generales) ---
    {
        id: "caba",
        category: "caba",
        name: "CABA (Capital Federal Completa)",
        shortName: "CABA Total",
        price: 8000,
        badge: "Cobertura Completa",
        schedule: "Domingo (18:00 a 21:00 hs) y Lunes (10:00 a 13:00 / 18:00 a 21:00 hs)",
        description: "Reparto en los 48 barrios de la Capital Federal. Entregas coordinadas en franjas horarias cómodas.",
        neighborhoods: [
            "Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo", "Caballito", 
            "Chacarita", "Coghlan", "Colegiales", "Constitución", "Flores", "Floresta", "La Boca", 
            "Liniers", "Mataderos", "Monte Castro", "Montserrat", "Nueva Pompeya", "Núñez", 
            "Palermo", "Parque Avellaneda", "Parque Chacabuco", "Parque Chas", "Parque Patricios", 
            "Paternal", "Puerto Madero", "Recoleta", "Retiro", "Saavedra", "San Cristóbal", 
            "San Nicolás", "San Telmo", "Vélez Sársfield", "Versalles", "Villa Crespo", 
            "Villa del Parque", "Villa Devoto", "Villa General Mitre", "Villa Lugano", 
            "Villa Luro", "Villa Ortúzar", "Villa Pueyrredón", "Villa Real", "Villa Riachuelo", 
            "Villa Santa Rita", "Villa Soldati", "Villa Urquiza"
        ]
    },
    {
        id: "gba-oeste",
        category: "gba-oeste",
        name: "GBA Zona Oeste (General)",
        shortName: "Zona Oeste Total",
        price: 4000,
        badge: "Nuestra Cocina Central (Ituzaingó)",
        schedule: "Domingo (18:00 a 21:00 hs) y Lunes (10:00 a 14:00 hs)",
        description: "Elaboración y despacho local desde nuestra sede en Zárate 3171, Ituzaingó, hacia todos los partidos del oeste.",
        neighborhoods: [
            "Ituzaingó (Zárate 3171 - Cocina Central)", "Parque Leloir", "Villa Udaondo",
            "Castelar", "Morón", "Haedo", "El Palomar", "Villa Sarmiento",
            "Ramos Mejía", "San Justo", "Ciudadela", "Villa Luzuriaga", "Lomas del Mirador",
            "Hurlingham", "Villa Tesei", "William Morris",
            "Caseros", "Ciudad Jardín", "Santos Lugares", "Sáenz Peña", "Martín Coronado"
        ]
    },
    {
        id: "corporativo",
        category: "corporativo",
        name: "Clientes Corporativos / Empresas",
        shortName: "Empresas",
        price: 0,
        badge: "100% Bonificado",
        schedule: "Lunes antes de las 12:00 hs (o según convenio coordinado)",
        description: "Entregas directas en oficinas y sedes de empresas clientes en CABA y Gran Buenos Aires.",
        neighborhoods: [
            "Entregas programadas en recepción o comedor corporativo.",
            "Viandas empaquetadas e identificadas por colaborador.",
            "Costo de entrega 100% bonificado en todos los pedidos."
        ]
    }
];

class NutriRootsApp {
    constructor() {
        // Datos de configuración
        this.WHATSAPP_NUMBER = "5491155555555"; // Número de WhatsApp del negocio (formato internacional sin +)
        this.SHIPPING_COST = 4000; // Costo base de envío (Zona Oeste)

        // Estado de la aplicación
        this.menu = [];
        this.orders = [];
        this.cart = [];
        this.selectedCategory = "Todas";
        this.selectedDeliveryZone = "gba-oeste"; // Zona Oeste (Ituzaingó) por defecto
        this.currentZoneFilter = "todas"; // Filtro de vista de zonas
        this.zoneSearchQuery = ""; // Búsqueda de barrios
        this.currentView = "landing"; // Vista de selección de cocina por defecto
        this.currentAdminTab = "orders";
        this.currentOrderFilter = "all";
        this.menuLayout = "list"; // Vista de lista por defecto para los 10 menús semanales
        this.activeCompany = null; // Empresa activa ('nutriroots' o 'corporativo')
        this.adminSession = null; // Sesión de administrador activa ('nutriroots' o 'corporativo')
        this.clientCompany = null; // Empresa cliente activa (solo en catálogo corporativo)
        this.companies = []; // Lista de empresas clientes autorizadas (solo corporativo)
        this.catalogType = "particular"; // Catálogo de viandas activo ('particular' o 'corporativo')
        this.lastOrder = null; // Último pedido registrado para mostrar resumen en pantalla de éxito
        this.zonesEnabled = true; // Zonas y Envíos visible al público (se controla desde el Panel Admin)

        // Estado del Mapa Interactivo y Coordenadas Zárate 3171, Ituzaingó
        this.deliveryMap = null;
        this.zoneLayers = {};
        this.radiusLayers = [];
        this.mapDisplayMode = "polygons";
        this.kitchenCoords = [-34.64016, -58.68501]; // Zárate 3171, Ituzaingó
        this.clickedMapLocation = null;
        this.clickMarker = null;

        // Inicializar
        document.addEventListener("DOMContentLoaded", () => this.init());
    }

    async init() {
        this.activeCompany = "nutriroots";
        await this.loadData();
        await this.loadSettings();

        // Mientras el admin tiene el panel abierto, trae pedidos nuevos cada 60 segundos
        setInterval(() => {
            if (this.currentView === "admin" && !document.hidden) this.refreshOrders();
        }, 60000);

        // Recuperar último pedido de la sesión si existiera
        const savedLastOrder = sessionStorage.getItem("nr_last_order");
        if (savedLastOrder) {
            try {
                this.lastOrder = JSON.parse(savedLastOrder);
            } catch (e) {
                console.error("Error al cargar último pedido:", e);
            }
        }

        // Escuchar cambios de sesión de Firebase Auth si está cargado
        if (typeof firebase !== "undefined" && typeof firebase.auth === "function") {
            try {
                firebase.auth().onAuthStateChanged((user) => {
                    if (user && user.email) {
                        this.adminSession = user.email;
                        sessionStorage.setItem("nr_admin_session", user.email);
                    }
                });
            } catch (e) {
                console.error("Error al suscribir a Firebase Auth:", e);
            }
        }

        // Verificar sesión de administración guardada
        const savedSession = sessionStorage.getItem("nr_admin_session");
        if (savedSession) {
            this.adminSession = savedSession;
            this.selectCompany("nutriroots", false);
            this.showView("admin");
            return;
        }

        // Verificar si ingresa con (?admin) directo, abrir login
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("admin")) {
            this.updateNavVisibility("login");
            this.showView("login");
            return;
        }

        // Por defecto mostrar el landing page para elegir tipo de cliente
        this.selectCompany("nutriroots", false);
        this.showView("landing");

        // Establecer fecha mínima en el formulario (hoy)
        const dateInput = document.getElementById("checkout-date");
        if (dateInput) {
            const today = new Date().toISOString().split("T")[0];
            dateInput.min = today;
            dateInput.value = today;
        }

        // Vista de zonas lista en el DOM según modelo Homefood
    }

    // --- CONFIGURACIÓN: Mostrar/ocultar "Zonas y Envíos" al público ---
    async loadSettings() {
        try {
            const doc = await db.collection("nutriroots_data").doc("settings").get();
            // Si el documento no existe o falla, la sección queda visible (comportamiento anterior)
            this.zonesEnabled = !(doc.exists && doc.data().zonesEnabled === false);
        } catch (error) {
            console.error("No se pudo leer la configuración, Zonas queda visible:", error);
            this.zonesEnabled = true;
        }
        this.applyZonesVisibility();
    }

    toggleZonesEnabled(enabled) {
        this.zonesEnabled = !!enabled;
        // Solo escribe cuando el admin cambia el interruptor (nunca al cargar la página)
        db.collection("nutriroots_data").doc("settings").set({ zonesEnabled: this.zonesEnabled }, { merge: true }).catch(console.error);
        this.backupDoc("settings", { zonesEnabled: this.zonesEnabled });
        this.applyZonesVisibility();
    }

    applyZonesVisibility() {
        // El admin siempre ve la sección para poder seguir trabajándola; el público solo si está activada
        const hidden = !this.zonesEnabled && !this.adminSession;
        document.documentElement.classList.toggle("zones-hidden", hidden);

        const toggle = document.getElementById("admin-zones-toggle");
        if (toggle) toggle.checked = this.zonesEnabled;
        const label = document.getElementById("admin-zones-status");
        if (label) {
            label.textContent = this.zonesEnabled ? "Visible al público" : "Oculta al público";
            label.style.color = this.zonesEnabled ? "var(--green-success)" : "#ef4444";
        }
    }

    // --- RESPALDO AUTOMÁTICO (backup_*) ---
    // Cada cambio importante se copia a colecciones de respaldo en Firestore. Nunca se escribe al cargar la página
    // y un fallo del respaldo jamás interrumpe la operación principal.
    cleanForBackup(data) {
        return JSON.parse(JSON.stringify(data));
    }

    backupOrder(order, extra = {}) {
        if (!order || !order.id || typeof db === "undefined") return;
        try {
            db.collection("backup_orders").doc(order.id)
                .set({ ...this.cleanForBackup(order), ...extra, _backupAt: new Date().toISOString() }, { merge: true })
                .catch(e => console.error("Respaldo de pedido falló:", e));
        } catch (e) { console.error("Respaldo de pedido falló:", e); }
    }

    backupMenu(menu, withHistory = true) {
        // Nunca se respalda un menú vacío: así un vaciado accidental no puede borrar la última copia buena
        if (!Array.isArray(menu) || menu.length === 0 || typeof db === "undefined") return;
        try {
            const payload = { data: this.cleanForBackup(menu), count: menu.length, savedAt: new Date().toISOString() };
            db.collection("backup_data").doc("menu_latest").set(payload).catch(e => console.error("Respaldo de menú falló:", e));
            if (withHistory) {
                db.collection("backup_menu_history").doc(String(Date.now())).set(payload).catch(e => console.error("Historial de menú falló:", e));
            }
        } catch (e) { console.error("Respaldo de menú falló:", e); }
    }

    backupDoc(name, data) {
        if (typeof db === "undefined" || data === undefined || data === null) return;
        if (Array.isArray(data) && data.length === 0) return; // no pisar una copia buena con una lista vacía
        try {
            const payload = Array.isArray(data) ? { data: this.cleanForBackup(data) } : this.cleanForBackup(data);
            db.collection("backup_data").doc(name).set({ ...payload, _backupAt: new Date().toISOString() }).catch(e => console.error("Respaldo falló:", e));
        } catch (e) { console.error("Respaldo falló:", e); }
    }

    // Descarga todo lo que hay hoy en Firebase en un archivo JSON (copia fuera de Firebase)
    async exportFullBackup() {
        try {
            const [menuDoc, companiesDoc, settingsDoc, ordersSnap] = await Promise.all([
                db.collection("nutriroots_data").doc("menu").get(),
                db.collection("nutriroots_data").doc("companies").get(),
                db.collection("nutriroots_data").doc("settings").get(),
                db.collection("orders").get()
            ]);
            const backup = {
                exportedAt: new Date().toISOString(),
                menu: menuDoc.exists ? menuDoc.data().data : [],
                companies: companiesDoc.exists ? companiesDoc.data().data : [],
                settings: settingsDoc.exists ? settingsDoc.data() : {},
                orders: ordersSnap.docs.map(d => d.data())
            };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `respaldo_nutriroots_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert(`Respaldo descargado: ${backup.orders.length} pedidos y ${backup.menu.length} platos.`);
        } catch (error) {
            console.error("No se pudo exportar el respaldo:", error);
            alert("No se pudo descargar el respaldo. Revisá tu conexión e intentá de nuevo.");
        }
    }

    // Vuelve a crear los pedidos que están en el respaldo pero faltan en la lista principal (ignora los eliminados a propósito)
    async restoreMissingOrders() {
        try {
            const [mainSnap, backupSnap] = await Promise.all([
                db.collection("orders").get(),
                db.collection("backup_orders").get()
            ]);
            const existing = new Set(mainSnap.docs.map(d => d.data().id));
            const missing = backupSnap.docs.map(d => d.data()).filter(o => o.id && !existing.has(o.id) && !o.deletedAt);
            if (missing.length === 0) {
                alert("No hay pedidos para restaurar: todos los del respaldo ya están en la lista.");
                return;
            }
            if (!confirm(`Se van a restaurar ${missing.length} pedido(s) que faltan. ¿Continuar?`)) return;
            for (const o of missing) {
                const { _backupAt, deletedAt, ...order } = o;
                await db.collection("orders").doc(order.id).set(order);
            }
            await this.refreshOrders();
            alert(`Se restauraron ${missing.length} pedido(s).`);
        } catch (error) {
            console.error("No se pudieron restaurar los pedidos:", error);
            alert("No se pudo restaurar. Revisá tu conexión e intentá de nuevo.");
        }
    }

    // Permite elegir una versión anterior del menú (las últimas 10 guardadas) y volver a ella
    async restoreMenuFromHistory() {
        try {
            const snap = await db.collection("backup_menu_history").get();
            const versions = snap.docs.map(d => d.data()).filter(v => Array.isArray(v.data) && v.data.length > 0)
                .sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt))).slice(0, 10);
            if (versions.length === 0) {
                alert("Todavía no hay versiones anteriores del menú guardadas.");
                return;
            }
            const list = versions.map((v, i) => `${i + 1}) ${new Date(v.savedAt).toLocaleString("es-AR")} — ${v.count} platos`).join("\n");
            const answer = prompt(`Elegí qué versión del menú restaurar (número):\n\n${list}`);
            if (!answer) return;
            const chosen = versions[parseInt(answer, 10) - 1];
            if (!chosen) { alert("Número inválido."); return; }
            if (!confirm(`Esto reemplaza el menú actual por la versión con ${chosen.count} platos. ¿Continuar?`)) return;
            const ok = await this.updateMenuRemote(() => chosen.data);
            if (!ok) { alert("No se pudo restaurar el menú."); return; }
            this.renderCategoryChips();
            this.renderMenuGrid();
            this.renderMenuEditor();
            alert("Menú restaurado.");
        } catch (error) {
            console.error("No se pudo restaurar el menú:", error);
            alert("No se pudo restaurar. Revisá tu conexión e intentá de nuevo.");
        }
    }

    // --- UTILIDADES DE SEGURIDAD Y DATOS ---
    // Escapa texto antes de meterlo en innerHTML (evita que un cliente inyecte HTML/JS en el panel admin)
    escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // Convierte teléfonos argentinos escritos de cualquier forma al formato de WhatsApp (549 + área + número)
    normalizePhoneForWhatsApp(rawPhone) {
        let digits = String(rawPhone || "").replace(/\D/g, "");
        if (!digits) return "";
        if (digits.startsWith("00")) digits = digits.slice(2);
        if (digits.startsWith("54")) {
            digits = digits.slice(2);
            if (digits.startsWith("9")) digits = digits.slice(1);
        }
        if (digits.startsWith("0")) digits = digits.slice(1);
        if (/^15\d{8}$/.test(digits)) {
            // "15 12345678" sin código de área: se asume AMBA (11)
            digits = "11" + digits.slice(2);
        } else {
            // "11 15 12345678" -> "11 12345678"
            const m = digits.match(/^(\d{2,4})15(\d{6,8})$/);
            if (m && (m[1].length + m[2].length) === 10) digits = m[1] + m[2];
        }
        return digits.length === 10 ? "549" + digits : digits;
    }

    // Modifica el menú en Firebase de forma segura: lee la última versión, aplica SOLO el cambio y guarda.
    // Así un celular/pestaña con datos viejos nunca pisa los cambios hechos desde otro lado.
    async updateMenuRemote(mutator, { history = true } = {}) {
        const ref = db.collection("nutriroots_data").doc("menu");
        try {
            const result = await db.runTransaction(async (tx) => {
                const snap = await tx.get(ref);
                const current = snap.exists && snap.data() && Array.isArray(snap.data().data) ? snap.data().data : [];
                const next = JSON.parse(JSON.stringify(mutator(JSON.parse(JSON.stringify(current)))));
                tx.set(ref, { data: next });
                return next;
            });
            this.menu = result;
            try { localStorage.setItem("nr_menu_unified_v2", JSON.stringify(this.menu)); } catch (e) {}
            this.backupMenu(this.menu, history);
            return true;
        } catch (error) {
            console.error("No se pudo actualizar el menú en Firebase:", error);
            return false;
        }
    }

    // Vuelve a leer los pedidos desde Firebase (el panel admin los refresca solo cada minuto)
    async refreshOrders() {
        try {
            const snapshot = await db.collection("orders").get();
            this.orders = snapshot.docs.map(doc => doc.data());
            const modal = document.getElementById("order-modal");
            const modalOpen = modal && modal.style.display === "flex";
            if (this.currentView === "admin" && !modalOpen) {
                this.updateAdminStats();
                this.renderOrdersTable();
            }
        } catch (error) {
            console.error("No se pudieron refrescar los pedidos:", error);
        }
    }

    // --- MANEJO DE PERSISTENCIA ---
    async loadData() {
        try {
            const menuDoc = await db.collection("nutriroots_data").doc("menu").get();
            const ordersDoc = await db.collection("nutriroots_data").doc("orders").get();
            const companiesDoc = await db.collection("nutriroots_data").doc("companies").get();

            if (menuDoc.exists && menuDoc.data() && Array.isArray(menuDoc.data().data)) {
                this.menu = menuDoc.data().data;
                this.migrateMenuCategories();
            } else {
                // Si en Firebase no existe el documento, usamos localStorage solo como lectura local
                const localMenu = localStorage.getItem("nr_menu_unified_v2");
                if (localMenu) {
                    try {
                        this.menu = JSON.parse(localMenu);
                        this.migrateMenuCategories();
                    } catch (e) {
                        this.menu = [];
                    }
                } else {
                    this.menu = [];
                }
                // IMPORTANTE: Jamás guardar automáticamente en Firebase en el arranque para no pisar la nube.
            }

            // Colección para órdenes individuales
            const ordersSnapshot = await db.collection("orders").get();

            if (!ordersSnapshot.empty) {
                this.orders = ordersSnapshot.docs.map(doc => doc.data());
                // Ordenar por ID descendente (más nuevos primero)
                this.orders.sort((a, b) => {
                    const idA = a.id || "";
                    const idB = b.id || "";
                    return idB.localeCompare(idA);
                });
            } else {
                this.orders = [];
            }

            if (companiesDoc.exists && companiesDoc.data() && Array.isArray(companiesDoc.data().data)) {
                const parsed = companiesDoc.data().data;
                this.companies = parsed.map(c => typeof c === 'string' ? { name: c, password: 'corp123' } : c);
            } else {
                const localCompanies = localStorage.getItem("nr_companies_unified_v2");
                if (localCompanies) {
                    try {
                        const parsed = JSON.parse(localCompanies);
                        this.companies = parsed.map(c => typeof c === 'string' ? { name: c, password: 'corp123' } : c);
                    } catch (e) {
                        this.companies = [];
                    }
                } else {
                    this.companies = [
                        { name: "TechCorp", password: "corp123" },
                        { name: "Estudio Contable", password: "corp123" },
                        { name: "Banco Galicia", password: "corp123" }
                    ];
                }
            }

            console.log("Datos cargados correctamente desde Firebase.");
        } catch (error) {
            console.error("Error cargando Firebase, usando LocalStorage de respaldo:", error);
            // Fallback: intentar recuperar desde LocalStorage sin escribir nunca a Firebase
            const localMenu = localStorage.getItem("nr_menu_unified_v2");
            if (localMenu) {
                try {
                    this.menu = JSON.parse(localMenu);
                    this.migrateMenuCategories();
                } catch (e) {
                    console.error("Error parseando menú local:", e);
                    this.menu = [];
                }
            } else {
                this.menu = [];
            }
            const localOrders = localStorage.getItem("nr_orders_unified_v2");
            if (localOrders) {
                try {
                    this.orders = JSON.parse(localOrders);
                } catch (e) {
                    console.error("Error parseando pedidos locales:", e);
                    this.orders = [];
                }
            } else {
                this.orders = [];
            }
            const localCompanies = localStorage.getItem("nr_companies_unified_v2");
            if (localCompanies) {
                try {
                    const parsed = JSON.parse(localCompanies);
                    this.companies = parsed.map(c => typeof c === 'string' ? { name: c, password: 'corp123' } : c);
                } catch (e) {
                    console.error("Error parseando empresas locales:", e);
                    this.companies = [];
                }
            } else {
                this.companies = [];
            }
        }

        // Blindaje final: garantizar que sean arrays válidos sin reinyectar platos por defecto
        if (!Array.isArray(this.menu)) {
            this.menu = [];
        }
        if (!Array.isArray(this.orders)) {
            this.orders = [];
        }
        if (!Array.isArray(this.companies)) {
            this.companies = [];
        }
    }

    saveMenuToLocalStorage() {
        db.collection("nutriroots_data").doc("menu").set({ data: this.menu }).catch(console.error);
        localStorage.setItem("nr_menu_unified_v2", JSON.stringify(this.menu));
    }

    saveOrdersToLocalStorage() {
        // Mantenemos un caché local por si falla internet
        localStorage.setItem("nr_orders_unified_v2", JSON.stringify(this.orders));
    }

    saveCompaniesToLocalStorage() {
        db.collection("nutriroots_data").doc("companies").set({ data: this.companies }).catch(console.error);
        localStorage.setItem("nr_companies_unified_v2", JSON.stringify(this.companies));
        this.backupDoc("companies", this.companies);
    }

    migrateMenuCategories() {
        if (!Array.isArray(this.menu)) return;
        this.menu = this.menu.map(item => {
            if (!item.category || item.category.trim() === "") {
                return { ...item, category: "Clásicas" };
            }
            if (item.category === "Tartas y Pasteles") {
                return { ...item, category: "Tartas" };
            }
            if (item.category === "Clásicos") {
                return { ...item, category: "Clásicas" };
            }
            return item;
        });

        // Solo se guarda localmente en el navegador, jamás escribe en Firebase en el arranque
        try {
            localStorage.setItem("nr_menu_unified_v2", JSON.stringify(this.menu));
        } catch (e) {}
    }

    getMenuDayClass(tag) {
        if (!tag) return "menu-1";
        const match = tag.match(/\d+/);
        return match ? `menu-${match[0]}` : "menu-1";
    }

    updateNavVisibility(viewName) {
        this.applyZonesVisibility();
        const cartToggle = document.getElementById("btn-cart-toggle");
        const navClientLink = document.getElementById("nav-client-link");
        const navZonesLink = document.getElementById("nav-zones-link");
        const navAdminLink = document.getElementById("nav-admin-link");

        const catalogViews = ["client", "checkout"];
        const showCart = catalogViews.includes(viewName);

        if (cartToggle) {
            cartToggle.style.display = showCart ? "inline-flex" : "none";
        }
        if (navClientLink) {
            navClientLink.style.display = viewName === "landing" ? "none" : "";
        }
        if (navZonesLink) {
            navZonesLink.style.display = ""; // Visible siempre para fácil consulta
        }
        if (navAdminLink) {
            navAdminLink.style.display = "";
        }
    }

    // --- NAVEGACIÓN Y CONFIGURACIÓN MULTIEMPRESA ---
    handleBrandClick() {
        // Al apretar NutriRoots, limpia la empresa activa y sesión de cliente al volver al menú principal (landing page)
        this.activeCompany = null;
        this.clientCompany = null;
        sessionStorage.removeItem("nr_client_company");
        document.body.className = "";

        const cartToggle = document.getElementById("btn-cart-toggle");
        if (cartToggle) cartToggle.style.display = "none";

        const brandNameContainer = document.getElementById("brand-name-container");
        if (brandNameContainer) brandNameContainer.innerHTML = `Nutri<span>Roots</span>`;

        this.cart = [];
        this.updateCartUI();

        this.showView("landing");
    }

    handleCatalogLinkClick() {
        this.showView("client");
    }

    handleZonesLinkClick() {
        this.showView("zones");
    }

    // --- GESTIÓN Y RENDERIZADO DEL MAPA INTERACTIVO Y POLÍGONOS (MODELO HOMEFOOD) ---
    initDeliveryMap() {
        const mapContainer = document.getElementById("interactive-delivery-map");
        if (!mapContainer || typeof L === "undefined") return;

        // Si el mapa ya fue creado, reajustamos dimensiones y retornamos
        if (this.deliveryMap) {
            setTimeout(() => {
                if (this.deliveryMap) {
                    this.deliveryMap.invalidateSize();
                }
            }, 200);
            return;
        }

        try {
            // Inicializar Leaflet centrado en Zárate 3171, Ituzaingó
            this.deliveryMap = L.map("interactive-delivery-map", {
                center: this.kitchenCoords, // [-34.64016, -58.68501]
                zoom: 11,
                minZoom: 9,
                maxZoom: 17,
                zoomControl: true,
                scrollWheelZoom: false
            });

            // Capa de mosaicos OpenStreetMap estándar (100% libre, sin marca de agua ni clave API)
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> colaboradores',
                maxZoom: 19
            }).addTo(this.deliveryMap);

            // Marcador distintivo de la Cocina Central en Zárate 3171, Ituzaingó
            const kitchenIcon = L.divIcon({
                className: "custom-kitchen-leaflet-icon",
                html: `
                    <div class="kitchen-pulse-wrapper">
                        <div class="kitchen-pulse-ring"></div>
                        <div class="kitchen-central-marker" title="Zárate 3171, Ituzaingó">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        </div>
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 36],
                popupAnchor: [0, -36]
            });

            const kitchenMarker = L.marker(this.kitchenCoords, { icon: kitchenIcon }).addTo(this.deliveryMap);
            kitchenMarker.bindPopup(`
                <div style="font-family: var(--font-sans); padding: 0.2rem; min-width: 220px;">
                    <div style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.3rem;">
                        <span style="font-size: 1.1rem;">🏠</span>
                        <strong style="color: #ef4444; font-size: 0.96rem;">Cocina Central NutriRoots</strong>
                    </div>
                    <p style="margin: 0.2rem 0; font-size: 0.85rem; color: #374151; line-height: 1.4;">
                        <strong>📍 Zárate 3171, Ituzaingó</strong><br>
                        Sede de elaboración y punto de partida de todos los envíos con cadena de frío garantizada.
                    </p>
                    <div style="margin-top: 0.5rem; font-size: 0.78rem; color: #059669; font-weight: 700;">
                        ★ Envíos gratis a partir de 10 viandas
                    </div>
                </div>
            `);

            // Configurar polígonos por zona geográfica
            this.setupMapPolygons();

            // Configurar radios concéntricos de distancia
            this.setupMapRadiusCircles();

            // Evento al hacer clic en cualquier calle o punto del mapa
            this.deliveryMap.on("click", (e) => {
                this.handleMapClick(e.latlng.lat, e.latlng.lng);
            });

            // Invalidate size diferido para asegurar renderizado perfecto cuando la pestaña se hace visible
            setTimeout(() => {
                if (this.deliveryMap) {
                    this.deliveryMap.invalidateSize();
                }
            }, 300);

        } catch (error) {
            console.error("Error al inicializar el mapa de Leaflet:", error);
        }
    }

    setupMapPolygons() {
        if (!this.deliveryMap) return;

        // Coordenadas geográficas continuas y precisas por localidad del Área Metropolitana de Buenos Aires
        const zonePolygonCoords = {
            // --- GBA ZONA OESTE ---
            "ituzaingo": [
                [-34.612, -58.706], // Parque Leloir / Martín Fierro y Buen Ayre
                [-34.606, -58.675], // Reconquista y límite Hurlingham
                [-34.629, -58.658], // Acceso Oeste y Av. Santa Rosa
                [-34.656, -58.665], // Santa Rosa y Blas Parera
                [-34.673, -58.688], // Límite Merlo / Ituzaingó Sur
                [-34.658, -58.718], // San Antonio de Padua límite
                [-34.630, -58.720], // Límite Merlo Norte
                [-34.612, -58.706]  // Cierre en Parque Leloir
            ],
            "castelar": [
                [-34.629, -58.658], // Santa Rosa y Acceso Oeste
                [-34.627, -58.630], // Acceso Oeste y Vergara
                [-34.650, -58.632], // Morón centro límite
                [-34.685, -58.640], // Base Aérea Morón / Castelar Sur
                [-34.688, -58.670], // Límite Ituzaingó Sur
                [-34.673, -58.688],
                [-34.656, -58.665],
                [-34.629, -58.658]
            ],
            "moron-haedo": [
                [-34.627, -58.630], // Acceso Oeste y Vergara
                [-34.628, -58.588], // Acceso Oeste y Gaona / Dolores Prats / Haedo
                [-34.650, -58.572], // Haedo límite Ramos Mejía
                [-34.670, -58.595], // Morón Sur límite San Justo
                [-34.685, -58.640], // Base aérea Morón
                [-34.650, -58.632],
                [-34.627, -58.630]
            ],
            "hurlingham": [
                [-34.575, -58.650], // Río Reconquista / Camino del Buen Ayre
                [-34.570, -58.615], // Combate de Pavón / límite Tres de Febrero
                [-34.615, -58.610], // Vergara y Acceso Oeste
                [-34.627, -58.630], // Acceso Oeste límite Castelar
                [-34.629, -58.658], // Santa Rosa
                [-34.606, -58.675], // Límite Ituzaingó
                [-34.575, -58.650]
            ],
            "tres-de-febrero": [
                [-34.570, -58.615],
                [-34.575, -58.560], // Av. Márquez / San Martín
                [-34.598, -58.521], // General Paz y Av. San Martín
                [-34.628, -58.530], // General Paz y Acceso Oeste
                [-34.628, -58.588], // Acceso Oeste y Haedo
                [-34.615, -58.610], // Vergara
                [-34.570, -58.615]
            ],
            "la-matanza-norte": [
                [-34.628, -58.530], // General Paz y Acceso Oeste
                [-34.646, -58.528], // General Paz y Rivadavia (Liniers)
                [-34.671, -58.504], // General Paz y Mataderos
                [-34.695, -58.515], // San Justo Sur
                [-34.690, -58.565], // San Justo / Camino de Cintura
                [-34.670, -58.595], // Límite Morón
                [-34.650, -58.572], // Límite Haedo
                [-34.628, -58.588],
                [-34.628, -58.530]
            ],

            // --- CABA SECTORES ---
            "caba-oeste": [
                [-34.550, -58.483], // Balbín y Gral Paz
                [-34.580, -58.455], // Chacarita / Colegiales
                [-34.620, -58.445], // Caballito / Flores
                [-34.630, -58.400], // Constitución límite
                [-34.646, -58.374], // Riachuelo / Pte Pueyrredón
                [-34.664, -58.419], // Riachuelo / Pte Alsina
                [-34.693, -58.455], // Pte La Noria
                [-34.685, -58.475], // Dellepiane y Gral Paz
                [-34.671, -58.504], // Gral Paz y Mataderos
                [-34.646, -58.528], // Gral Paz y Liniers
                [-34.628, -58.530], // Gral Paz y Acceso Oeste
                [-34.598, -58.521], // Gral Paz y San Martín
                [-34.575, -58.508], // Gral Paz y Constituyentes
                [-34.550, -58.483]
            ],
            "caba-norte": [
                [-34.534, -58.465], // General Paz y Río de la Plata
                [-34.545, -58.442], // Costanera Norte
                [-34.568, -58.400], // Palermo / Recoleta límite
                [-34.588, -58.420], // Córdoba y Scalabrini Ortiz
                [-34.580, -58.455], // Chacarita / Colegiales
                [-34.550, -58.483], // General Paz y Balbín
                [-34.538, -58.473], // Puente Saavedra
                [-34.534, -58.465]
            ],
            "caba-centro": [
                [-34.568, -58.400], // Recoleta
                [-34.583, -58.373], // Retiro
                [-34.605, -58.358], // Puerto Madero
                [-34.636, -58.353], // La Boca
                [-34.630, -58.400], // Constitución / San Cristóbal
                [-34.620, -58.445], // Caballito
                [-34.588, -58.420], // Córdoba
                [-34.568, -58.400]
            ]
        };

        this.zoneStyles = {
            "ituzaingo": { color: "#10b981", fillColor: "#10b981", fillOpacity: 0.35, weight: 2.5, name: "Ituzaingó (Sede Central Zárate 3171)", price: "$2.500", dist: "0 a 4 km", days: "Lunes a Viernes", parentGroup: "gba-oeste" },
            "castelar": { color: "#059669", fillColor: "#059669", fillOpacity: 0.32, weight: 2.5, name: "Castelar", price: "$3.000", dist: "3 a 6 km", days: "Lunes a Viernes", parentGroup: "gba-oeste" },
            "moron-haedo": { color: "#0d9488", fillColor: "#0d9488", fillOpacity: 0.32, weight: 2.5, name: "Morón & Haedo", price: "$3.500", dist: "5 a 9 km", days: "Lunes, Miércoles y Viernes", parentGroup: "gba-oeste" },
            "hurlingham": { color: "#0284c7", fillColor: "#0284c7", fillOpacity: 0.32, weight: 2.5, name: "Hurlingham & Villa Tesei", price: "$3.500", dist: "4 a 8 km", days: "Martes y Jueves", parentGroup: "gba-oeste" },
            "tres-de-febrero": { color: "#6366f1", fillColor: "#6366f1", fillOpacity: 0.32, weight: 2.5, name: "Tres de Febrero (Caseros / El Palomar)", price: "$4.000", dist: "8 a 13 km", days: "Martes y Jueves", parentGroup: "gba-oeste" },
            "la-matanza-norte": { color: "#8b5cf6", fillColor: "#8b5cf6", fillOpacity: 0.32, weight: 2.5, name: "Ramos Mejía & San Justo", price: "$4.000", dist: "7 a 12 km", days: "Miércoles y Viernes", parentGroup: "gba-oeste" },
            "caba-oeste": { color: "#ea580c", fillColor: "#ea580c", fillOpacity: 0.32, weight: 2.5, name: "CABA Oeste (Devoto, Flores, Liniers)", price: "$7.000", dist: "12 a 16 km", days: "Domingo y Lunes", parentGroup: "caba" },
            "caba-norte": { color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.32, weight: 2.5, name: "CABA Norte (Palermo, Belgrano, Núñez)", price: "$7.500", dist: "15 a 20 km", days: "Domingo y Lunes", parentGroup: "caba" },
            "caba-centro": { color: "#e11d48", fillColor: "#e11d48", fillOpacity: 0.32, weight: 2.5, name: "CABA Centro (Caballito, Recoleta, Retiro)", price: "$8.000", dist: "17 a 23 km", days: "Domingo y Lunes", parentGroup: "caba" }
        };

        this.zoneLayers = {};

        Object.keys(zonePolygonCoords).forEach(zoneId => {
            const coords = zonePolygonCoords[zoneId];
            const meta = this.zoneStyles[zoneId];

            const polygon = L.polygon(coords, {
                color: meta.color,
                fillColor: meta.fillColor,
                fillOpacity: meta.fillOpacity,
                weight: meta.weight,
                className: `leaflet-zone-polygon polygon-${zoneId}`
            }).addTo(this.deliveryMap);

            polygon.bindPopup(`
                <div style="font-family: var(--font-sans); padding: 0.25rem; min-width: 220px;">
                    <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.35rem;">
                        <span style="display: inline-block; width: 11px; height: 11px; border-radius: 50%; background: ${meta.color}; flex-shrink: 0;"></span>
                        <strong style="color: var(--dark); font-size: 0.95rem; line-height: 1.2;">${meta.name}</strong>
                    </div>
                    <p style="margin: 0.3rem 0; font-size: 0.84rem; color: #4b5563; line-height: 1.45;">
                        <strong>Distancia a cocina:</strong> ${meta.dist}<br>
                        <strong>Días de entrega:</strong> ${meta.days}<br>
                        <strong>Tarifa de envío:</strong> <span style="font-weight:700; color:var(--dark);">${meta.price}</span>
                    </p>
                    <div style="margin-top: 0.4rem; font-size: 0.78rem; color: #059669; font-weight: 700;">
                        ★ ¡Envío GRATIS con 10 o más viandas!
                    </div>
                    <button type="button" class="btn-primary" style="margin-top: 0.6rem; width: 100%; padding: 0.45rem; font-size: 0.82rem;" onclick="app.selectZoneForOrder('${zoneId}')">
                        Seleccionar esta Localidad
                    </button>
                </div>
            `);

            // Interacción Hover
            polygon.on("mouseover", () => {
                polygon.setStyle({
                    weight: 4,
                    fillOpacity: 0.52
                });
                const card = document.getElementById(`zone-card-${meta.parentGroup}`);
                if (card) card.classList.add("is-highlighted");
            });

            polygon.on("mouseout", () => {
                polygon.setStyle({
                    weight: meta.weight,
                    fillOpacity: meta.fillOpacity
                });
                const card = document.getElementById(`zone-card-${meta.parentGroup}`);
                if (card) card.classList.remove("is-highlighted");
            });

            // Al hacer clic en el polígono, resalta la tarjeta y abre popup
            polygon.on("click", () => {
                polygon.openPopup();
                const card = document.getElementById(`zone-card-${meta.parentGroup}`);
                if (card) {
                    document.querySelectorAll(".hf-zone-card").forEach(c => c.classList.remove("is-highlighted"));
                    card.classList.add("is-highlighted");
                }
            });

            this.zoneLayers[zoneId] = polygon;
        });
    }

    setupMapRadiusCircles() {
        if (!this.deliveryMap) return;

        this.radiusLayers = [];

        // Radios concéntricos desde Zárate 3171, Ituzaingó
        const radii = [
            { km: 5, color: "#10b981", label: "Radio 5 km · Ituzaingó y Castelar ($2.500 / $3.000)" },
            { km: 10, color: "#0d9488", label: "Radio 10 km · Morón, Haedo, Hurlingham ($3.500)" },
            { km: 14, color: "#6366f1", label: "Radio 14 km · Tres de Febrero, Ramos Mejía ($4.000)" },
            { km: 22, color: "#f97316", label: "Radio 22 km · CABA ($7.000 a $8.000)" }
        ];

        radii.forEach(r => {
            const circle = L.circle(this.kitchenCoords, {
                radius: r.km * 1000,
                color: r.color,
                fillColor: r.color,
                fillOpacity: 0.07,
                weight: 1.5,
                dashArray: "6, 6"
            });

            circle.bindTooltip(r.label, { permanent: false, direction: "top" });
            this.radiusLayers.push(circle);
        });
    }

    setMapDisplayMode(mode) {
        this.mapDisplayMode = mode;

        const btnPoly = document.getElementById("btn-map-mode-polygons");
        const btnRad = document.getElementById("btn-map-mode-radius");

        if (mode === "polygons") {
            if (btnPoly) btnPoly.classList.add("active");
            if (btnRad) btnRad.classList.remove("active");

            // Mostrar polígonos y ocultar círculos
            Object.values(this.zoneLayers).forEach(layer => {
                if (!this.deliveryMap.hasLayer(layer)) {
                    this.deliveryMap.addLayer(layer);
                }
            });
            this.radiusLayers.forEach(circle => {
                if (this.deliveryMap.hasLayer(circle)) {
                    this.deliveryMap.removeLayer(circle);
                }
            });
        } else {
            if (btnRad) btnRad.classList.add("active");
            if (btnPoly) btnPoly.classList.remove("active");

            // Ocultar polígonos y mostrar círculos de radio
            Object.values(this.zoneLayers).forEach(layer => {
                if (this.deliveryMap.hasLayer(layer)) {
                    this.deliveryMap.removeLayer(layer);
                }
            });
            this.radiusLayers.forEach(circle => {
                if (!this.deliveryMap.hasLayer(circle)) {
                    this.deliveryMap.addLayer(circle);
                }
            });
        }
    }

    focusMapZone(zoneId) {
        if (!this.deliveryMap) this.initDeliveryMap();

        // Asegurar que estamos en modo polígonos
        if (this.mapDisplayMode !== "polygons") {
            this.setMapDisplayMode("polygons");
        }

        // Si se pide enfocar una macro-zona (Oeste o CABA)
        if (zoneId === "gba-oeste" || zoneId === "caba") {
            const layers = Object.keys(this.zoneStyles || {})
                .filter(id => this.zoneStyles[id].parentGroup === zoneId)
                .map(id => this.zoneLayers[id])
                .filter(Boolean);

            if (layers.length > 0 && typeof L.featureGroup === "function") {
                const group = L.featureGroup(layers);
                this.deliveryMap.fitBounds(group.getBounds(), {
                    padding: [30, 30],
                    animate: true,
                    duration: 0.8
                });
            }

            this.highlightZonePolygon(zoneId);
            document.querySelectorAll(".hf-zone-card").forEach(c => c.classList.remove("is-highlighted"));
            const card = document.getElementById(`zone-card-${zoneId}`);
            if (card) card.classList.add("is-highlighted");
            return;
        }

        // Si se pide enfocar una localidad específica
        const polygon = this.zoneLayers[zoneId];
        if (polygon && this.deliveryMap) {
            this.deliveryMap.fitBounds(polygon.getBounds(), {
                padding: [45, 45],
                maxZoom: 14,
                animate: true,
                duration: 0.8
            });

            this.highlightZonePolygon(zoneId);
            setTimeout(() => polygon.openPopup(), 500);

            // Resaltar la tarjeta padre
            const meta = this.zoneStyles ? this.zoneStyles[zoneId] : null;
            if (meta && meta.parentGroup) {
                document.querySelectorAll(".hf-zone-card").forEach(c => c.classList.remove("is-highlighted"));
                const card = document.getElementById(`zone-card-${meta.parentGroup}`);
                if (card) card.classList.add("is-highlighted");
            }
        }
    }

    highlightZonePolygon(zoneId) {
        if (zoneId === "gba-oeste" || zoneId === "caba") {
            Object.keys(this.zoneStyles || {}).forEach(id => {
                if (this.zoneStyles[id].parentGroup === zoneId && this.zoneLayers[id]) {
                    this.zoneLayers[id].setStyle({ weight: 3.5, fillOpacity: 0.48 });
                }
            });
            return;
        }

        const polygon = this.zoneLayers[zoneId];
        if (polygon) {
            polygon.setStyle({
                weight: 4,
                fillOpacity: 0.55
            });
        }
    }

    resetZonePolygonHighlight() {
        if (!this.zoneStyles) return;

        Object.keys(this.zoneLayers).forEach(zoneId => {
            const polygon = this.zoneLayers[zoneId];
            const meta = this.zoneStyles[zoneId];
            if (polygon && meta) {
                polygon.setStyle({
                    color: meta.color,
                    fillColor: meta.fillColor,
                    fillOpacity: meta.fillOpacity,
                    weight: meta.weight
                });
            }
        });

        document.querySelectorAll(".hf-zone-card").forEach(c => c.classList.remove("is-highlighted"));
    }

    resetMapZoom() {
        if (this.deliveryMap) {
            this.deliveryMap.setView(this.kitchenCoords, 11, {
                animate: true,
                duration: 0.8
            });
        }
    }

    // Algoritmo de punto en polígono (Ray Casting)
    isPointInPolygon(point, vs) {
        const x = point[0], y = point[1];
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            const xi = vs[i][0], yi = vs[i][1];
            const xj = vs[j][0], yj = vs[j][1];
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    // Fórmula de Haversine para calcular distancia esférica en km
    calculateDistanceKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseFloat((R * c).toFixed(1));
    }

    handleMapClick(lat, lng) {
        const km = this.calculateDistanceKm(this.kitchenCoords[0], this.kitchenCoords[1], lat, lng);

        // Detectar si cae dentro de alguna localidad específica buscando en cada polígono
        let detectedZoneId = null;
        const point = [lat, lng];

        for (const [zoneId, polygonLayer] of Object.entries(this.zoneLayers)) {
            const latlngs = polygonLayer.getLatLngs()[0].map(ll => [ll.lat, ll.lng]);
            if (this.isPointInPolygon(point, latlngs)) {
                detectedZoneId = zoneId;
                break;
            }
        }

        // Heurística de respaldo si el clic fue en un límite intermedio
        if (!detectedZoneId) {
            if (km <= 4.5) {
                detectedZoneId = "ituzaingo";
            } else if (km <= 7.5) {
                detectedZoneId = "castelar";
            } else if (km <= 11) {
                detectedZoneId = "moron-haedo";
            } else if (lng > -58.53 && lng < -58.35 && lat >= -34.70 && lat <= -34.53) {
                detectedZoneId = "caba-centro";
            } else {
                detectedZoneId = "fuera-de-zona";
            }
        }

        const zoneConfig = DELIVERY_ZONES_CONFIG.find(z => z.id === detectedZoneId);
        const zoneName = zoneConfig ? zoneConfig.name : "Fuera de Cobertura Habitual";
        const zonePrice = zoneConfig ? `$${zoneConfig.price.toLocaleString("es-AR")}` : "Consultar";

        this.clickedMapLocation = {
            lat,
            lng,
            km,
            zoneId: detectedZoneId,
            zoneName,
            zonePrice
        };

        // Colocar marcador visual en el punto cliqueado
        if (this.clickMarker) {
            this.deliveryMap.removeLayer(this.clickMarker);
        }

        const clickIcon = L.divIcon({
            className: "click-map-pin-icon",
            html: `<div style="font-size: 24px; text-shadow: 0 2px 6px rgba(0,0,0,0.3); transform: translate(-12px, -24px);">📍</div>`,
            iconSize: [24, 24]
        });

        this.clickMarker = L.marker([lat, lng], { icon: clickIcon }).addTo(this.deliveryMap);

        // Actualizar tarjeta flotante
        const cardEl = document.getElementById("map-distance-floating-card");
        const kmEl = document.getElementById("distance-card-km");
        const zoneEl = document.getElementById("distance-card-zone");
        const priceEl = document.getElementById("distance-card-price");
        const actionBtn = document.getElementById("distance-card-action-btn");

        if (cardEl && kmEl && zoneEl && priceEl) {
            kmEl.innerText = `${km} km`;
            zoneEl.innerText = zoneName;
            priceEl.innerText = zonePrice;

            if (detectedZoneId === "fuera-de-zona") {
                if (actionBtn) {
                    actionBtn.innerText = "Consultar Envío por WhatsApp";
                    actionBtn.onclick = () => {
                        window.open(`https://api.whatsapp.com/send?phone=5491126365636&text=Hola!%20Estoy%20a%20${km}km%20de%20Zárate%203171%20y%20quería%20consultar%20por%20envío`, "_blank");
                    };
                }
            } else {
                if (actionBtn) {
                    actionBtn.innerText = `Elegir ${zoneConfig ? zoneConfig.shortName : 'esta Zona'} y Pedir`;
                    actionBtn.onclick = () => this.selectZoneFromMapClick();
                }
            }

            cardEl.style.display = "block";
        }

        // Resaltar la tarjeta correspondiente en la columna izquierda
        if (detectedZoneId && detectedZoneId !== "fuera-de-zona") {
            this.highlightZonePolygon(detectedZoneId);
            const card = document.getElementById(`zone-card-${detectedZoneId}`);
            if (card) {
                document.querySelectorAll(".hf-zone-card").forEach(c => c.classList.remove("is-highlighted"));
                card.classList.add("is-highlighted");
            }
        }
    }

    closeDistanceCard() {
        const cardEl = document.getElementById("map-distance-floating-card");
        if (cardEl) {
            cardEl.style.display = "none";
        }
        if (this.clickMarker && this.deliveryMap) {
            this.deliveryMap.removeLayer(this.clickMarker);
            this.clickMarker = null;
        }
        this.resetZonePolygonHighlight();
    }

    selectZoneFromMapClick() {
        if (this.clickedMapLocation && this.clickedMapLocation.zoneId) {
            this.selectZoneForOrder(this.clickedMapLocation.zoneId);
            this.closeDistanceCard();
        }
    }

    selectZoneForOrder(zoneId) {
        this.selectedDeliveryZone = zoneId;

        if (zoneId === "corporativo") {
            this.showView("corporate-login");
            return;
        }

        // Sincronizar selector en checkout
        const zoneSelect = document.getElementById("checkout-zone");
        if (zoneSelect) {
            zoneSelect.value = zoneId;
        }

        this.setCatalogType("particular");
        this.showView("client");

        // Feedback sutil
        const zoneObj = DELIVERY_ZONES_CONFIG.find(z => z.id === zoneId);
        if (zoneObj) {
            console.log(`Zona seleccionada: ${zoneObj.name}`);
        }
    }

    handleZoneChange() {
        const zoneSelect = document.getElementById("checkout-zone");
        if (zoneSelect) {
            this.selectedDeliveryZone = zoneSelect.value;
        }
        this.renderCheckoutSummary();
        this.updateCartUI();
    }

    handleAdminLinkClick() {
        if (this.adminSession) {
            this.showView("admin");
        } else {
            const errorMsg = document.getElementById("login-error-msg");
            if (errorMsg) errorMsg.style.display = "none";
            document.getElementById("login-form").reset();
            this.showView("login");
        }
    }

    selectCompany(companyId, redirectToClient = true) {
        this.activeCompany = "nutriroots";
        document.body.className = "theme-nutriroots";
        this.WHATSAPP_NUMBER = "5491155555555";

        // Datos ya cargados en init()

        const cartToggle = document.getElementById("btn-cart-toggle");
        if (cartToggle) cartToggle.style.display = "inline-flex";

        const brandNameContainer = document.getElementById("brand-name-container");
        if (brandNameContainer) brandNameContainer.innerHTML = `Nutri<span>Roots</span>`;

        const adminSidebarTitle = document.getElementById("admin-sidebar-title");
        if (adminSidebarTitle) adminSidebarTitle.innerText = "Panel de Control";

        const heroTitle = document.getElementById("client-hero-title");
        const heroDesc = document.getElementById("client-hero-desc");
        if (heroTitle) heroTitle.innerHTML = `Comida casera, lista para <span>disfrutar</span> en tu mesa.`;
        if (heroDesc) heroDesc.innerText = "Cocinamos diariamente con ingredientes frescos y seleccionados. Elige tus platos semanales y recíbelos en la puerta de tu hogar.";

        this.cart = [];
        this.updateCartUI();

        this.setCatalogType(this.catalogType);

        if (redirectToClient) {
            this.showView("client");
        }
    }

    setCatalogType(type) {
        this.catalogType = type;

        const btnPart = document.getElementById("btn-catalog-particular");
        const btnCorp = document.getElementById("btn-catalog-corporativo");
        const brandNameContainer = document.getElementById("brand-name-container");
        const heroTitle = document.getElementById("client-hero-title");
        const heroDesc = document.getElementById("client-hero-desc");

        if (type === "particular") {
            document.body.className = "theme-nutriroots";
            if (btnPart) {
                btnPart.className = "btn-primary";
                btnPart.style.background = "";
                btnPart.style.color = "";
                btnPart.style.borderColor = "";
            }
            if (btnCorp) {
                btnCorp.className = "btn-secondary";
                btnCorp.style.background = "var(--white)";
                btnCorp.style.color = "var(--dark)";
                btnCorp.style.borderColor = "var(--gray-300)";
            }
            if (brandNameContainer) {
                brandNameContainer.innerHTML = `Nutri<span>Roots</span>`;
            }
            if (heroTitle) {
                heroTitle.innerHTML = `Comida casera, lista para <span>disfrutar</span> en tu mesa.`;
            }
            if (heroDesc) {
                heroDesc.innerText = "Cocinamos diariamente con ingredientes frescos y seleccionados. Elige tus platos semanales y recíbelos en la puerta de tu hogar.";
            }
        } else {
            document.body.className = "theme-corporativo";
            if (btnCorp) {
                btnCorp.className = "btn-primary";
                btnCorp.style.background = "";
                btnCorp.style.color = "";
                btnCorp.style.borderColor = "";
            }
            if (btnPart) {
                btnPart.className = "btn-secondary";
                btnPart.style.background = "var(--white)";
                btnPart.style.color = "var(--dark)";
                btnPart.style.borderColor = "var(--gray-300)";
            }
            if (brandNameContainer) {
                brandNameContainer.innerHTML = `Nutri<span>Roots</span> <span style="font-size: 0.85rem; background: var(--primary-light); color: var(--primary); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); font-weight: 700; margin-left: 0.5rem; vertical-align: middle;">Corp</span>`;
            }
            if (heroTitle) {
                heroTitle.innerHTML = `Menús Ejecutivos y Viandas para tu <span>Día de Oficina</span>`;
            }
            if (heroDesc) {
                heroDesc.innerText = "Cocinamos platos de categoría premium para equipos de trabajo y empresas. Almuerzos nutritivos entregados directamente en tu oficina.";
            }
        }

        this.cart = [];
        this.updateCartUI();

        this.selectedCategory = "Todas";
        this.renderCategoryChips();
        this.renderMenuGrid();
    }

    async handleLoginSubmit(event) {
        if (event && event.preventDefault) event.preventDefault();
        const usernameInput = document.getElementById("login-username");
        const passwordInput = document.getElementById("login-password");
        const errorMsg = document.getElementById("login-error-msg");
        const errorText = document.getElementById("login-error-text");
        const submitBtn = document.getElementById("btn-login-submit");

        const username = usernameInput ? usernameInput.value.trim().toLowerCase() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (errorMsg) errorMsg.style.display = "none";

        // Autenticación oficial con Firebase Auth cuando esté disponible
        if (typeof firebase !== "undefined" && typeof firebase.auth === "function" && typeof firebase.auth().signInWithEmailAndPassword === "function") {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Verificando...";
            }
            try {
                // Permite ingresar con el email directo o 'admin'/'nutriroots' que mapea al correo oficial
                const emailToAuth = username.includes("@") ? username : "pintolucasnicolas@gmail.com";
                const userCredential = await firebase.auth().signInWithEmailAndPassword(emailToAuth, password);
                const user = userCredential.user;
                this.adminSession = user.email || "admin";
                sessionStorage.setItem("nr_admin_session", this.adminSession);
                this.selectCompany("nutriroots", false);
                this.showView("admin");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Iniciar Sesión";
                }
                return;
            } catch (authError) {
                console.error("Fallo de autenticación Firebase:", authError.code, authError.message);
                if (errorMsg) {
                    if (errorText) {
                        if (authError.code === "auth/invalid-credential" || authError.code === "auth/wrong-password" || authError.code === "auth/user-not-found") {
                            errorText.textContent = "Correo o contraseña incorrectos.";
                        } else if (authError.code === "auth/too-many-requests") {
                            errorText.textContent = "Demasiados intentos. Esperá unos minutos.";
                        } else {
                            errorText.textContent = "Error al iniciar sesión: " + (authError.message || "Revisá los datos.");
                        }
                    }
                    errorMsg.style.display = "flex";
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Iniciar Sesión";
                }
                return;
            }
        }

        // Modo fallback (para pruebas automáticas o sin Firebase Auth cargado)
        const credentials = {
            "admin": "roots123",
            "nutriroots": "roots123",
            "pintolucasnicolas@gmail.com": "roots123"
        };

        if (credentials[username] && credentials[username] === password) {
            if (errorMsg) errorMsg.style.display = "none";
            this.adminSession = username;
            sessionStorage.setItem("nr_admin_session", username);
            this.selectCompany("nutriroots", false);
            this.showView("admin");
        } else {
            if (errorMsg) {
                if (errorText) errorText.textContent = "Usuario o contraseña incorrectos.";
                errorMsg.style.display = "flex";
            }
        }
    }

    handleLogout() {
        if (typeof firebase !== "undefined" && typeof firebase.auth === "function") {
            try {
                firebase.auth().signOut().catch(console.error);
            } catch (e) {}
        }
        sessionStorage.removeItem("nr_admin_session");
        this.adminSession = null;
        this.activeCompany = "nutriroots";

        const cartToggle = document.getElementById("btn-cart-toggle");
        if (cartToggle) cartToggle.style.display = "inline-flex";

        const brandNameContainer = document.getElementById("brand-name-container");
        if (brandNameContainer) brandNameContainer.innerHTML = `Nutri<span>Roots</span>`;

        this.cart = [];
        this.updateCartUI();

        this.showView("landing");
    }

    selectLandingOption(type) {
        if (type === 'particular') {
            this.setCatalogType('particular');
            this.showView('client');
        } else if (type === 'corporativo') {
            this.showView('corporate-login');
        }
    }

    handleCorporateLoginSubmit(event) {
        event.preventDefault();
        const companySelect = document.getElementById("corporate-company-select").value;
        const password = document.getElementById("corporate-login-password").value;
        const errorMsg = document.getElementById("corporate-login-error-msg");

        const companyObj = this.companies.find(c => c.name === companySelect);

        if (companyObj && password === companyObj.password) {
            if (errorMsg) errorMsg.style.display = "none";
            this.clientCompany = companySelect;
            this.setCatalogType('corporativo');
            this.showView("client");
        } else {
            if (errorMsg) errorMsg.style.display = "block";
        }
    }

    // --- CONTROL DE VISTAS (SPA) ---
    showView(viewName) {
        // Si Zonas está desactivada y no es admin, redirigir al inicio
        if (viewName === "zones" && !this.zonesEnabled && !this.adminSession) {
            viewName = "landing";
        }
        this.currentView = viewName;

        // Ocultar todas las secciones
        document.querySelectorAll(".view-section").forEach(section => {
            section.style.display = "none";
        });

        // Quitar active de nav links
        const navClientLink = document.getElementById("nav-client-link");
        const navAdminLink = document.getElementById("nav-admin-link");
        const navZonesLink = document.getElementById("nav-zones-link");
        if (navClientLink) navClientLink.classList.remove("active");
        if (navAdminLink) navAdminLink.classList.remove("active");
        if (navZonesLink) navZonesLink.classList.remove("active");

        this.updateNavVisibility(viewName);

        // Mostrar vista activa
        const activeSection = document.getElementById(`view-${viewName}`);
        if (activeSection) {
            if (viewName === "admin") {
                activeSection.style.display = "grid"; // Admin usa grid
                if (navAdminLink) navAdminLink.classList.add("active");

                const sideCompaniesBtn = document.getElementById("side-companies-btn");
                if (sideCompaniesBtn) {
                    sideCompaniesBtn.style.display = "block";
                }

                this.switchAdminTab(this.currentAdminTab);
                this.updateAdminStats();
                this.renderOrdersTable();
                this.renderMenuEditor();
                this.refreshOrders();
            } else {
                activeSection.style.display = "block";
                if (viewName === "client" && navClientLink) {
                    navClientLink.classList.add("active");
                }
                if (viewName === "zones") {
                    if (navZonesLink) navZonesLink.classList.add("active");
                    this.initDeliveryMap();
                }
                if (viewName === "corporate-login") {
                    const corpCompanySelect = document.getElementById("corporate-company-select");
                    if (corpCompanySelect) {
                        corpCompanySelect.innerHTML = '<option value="" disabled selected>Selecciona tu empresa...</option>' +
                            this.companies.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)}</option>`).join("");
                    }
                }
                if (viewName === "checkout") {
                    const companySelect = document.getElementById("checkout-company-select");
                    if (companySelect) {
                        companySelect.innerHTML = '<option value="" disabled selected>Selecciona tu empresa...</option>' +
                            this.companies.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)}</option>`).join("");
                    }
                    if (this.catalogType === "corporativo" && this.clientCompany) {
                        companySelect.value = this.clientCompany;
                    }

                    const typeSelect = document.getElementById("checkout-type");
                    if (typeSelect) {
                        typeSelect.value = this.catalogType;
                    }
                    this.handleCheckoutTypeChange();
                }
                if (viewName === "success") {
                    if (this.lastOrder) {
                        this.renderSuccessView(this.lastOrder);
                    }
                }
            }
        }

        // Cerrar carrito por si está abierto
        this.closeCart();

        // Actualizar UI del carrito (mostrar/ocultar barra flotante)
        this.updateCartUI();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    scrollToMenu() {
        const menuGrid = document.getElementById("menú-section") || document.getElementById("menu-section");
        if (menuGrid) {
            menuGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // --- LÓGICA DEL CLIENTE Y CATÁLOGO ---
    getCategories() {
        const categories = new Set(this.menu.map(item => item.category).filter(c => c && c.trim() !== ""));
        return ["Todas", ...categories];
    }

    renderCategoryChips() {
        const container = document.getElementById("categories-list");
        if (!container) return;

        const categories = this.getCategories();
        container.innerHTML = categories.map(cat => `
            <button class="category-chip ${cat === this.selectedCategory ? 'active' : ''}" 
                    onclick="app.selectCategory('${cat}', this)">
                ${cat}
            </button>
        `).join("");
    }

    selectCategory(category, element) {
        this.selectedCategory = category;

        // Actualizar chips activos
        document.querySelectorAll(".category-chip").forEach(chip => {
            chip.classList.remove("active");
        });
        element.classList.add("active");

        this.renderMenuGrid();
    }

    setMenuLayout(layoutType) {
        this.menuLayout = layoutType;

        const container = document.getElementById("menu-container");
        const btnList = document.getElementById("btn-layout-list");
        const btnGrid = document.getElementById("btn-layout-grid");

        if (container) {
            if (layoutType === 'list') {
                container.className = 'menu-list';
                if (btnList) btnList.classList.add('active');
                if (btnGrid) btnGrid.classList.remove('active');
            } else {
                container.className = 'menu-grid';
                if (btnList) btnList.classList.remove('active');
                if (btnGrid) btnGrid.classList.add('active');
            }
        }

        this.renderMenuGrid();
    }

    renderMenuGrid() {
        const container = document.getElementById("menu-container");
        if (!container) return;

        let filteredMenu = this.menu.filter(item => {
            if (this.catalogType === "particular") {
                return item.type === "particular" || item.type === "ambos" || !item.type;
            } else {
                return item.type === "corporativo" || item.type === "ambos";
            }
        });

        if (this.selectedCategory !== "Todas") {
            filteredMenu = filteredMenu.filter(item => item.category === this.selectedCategory);
        }

        if (filteredMenu.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--dark-muted)">No hay platos disponibles en esta categoría.</div>`;
            return;
        }

        if (this.menuLayout === 'list') {
            container.innerHTML = filteredMenu.map(item => {
                const isAvailable = item.available !== false && (item.stock == null || item.stock > 0);
                const imageUrl = item.image && item.image.trim() !== ""
                    ? item.image
                    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

                const cartItem = this.cart.find(c => c.id === item.id);
                const qtyHtml = cartItem
                    ? `
                        <div class="list-qty-selector">
                            <button class="list-qty-btn" onclick="app.updateCartQuantity('${item.id}', -1)">-</button>
                            <span class="list-qty-val">${cartItem.quantity}</span>
                            <button class="list-qty-btn" onclick="app.updateCartQuantity('${item.id}', 1)">+</button>
                        </div>
                      `
                    : `
                        <button class="btn-list-add" onclick="app.addToCart('${item.id}')" ${!isAvailable ? 'disabled style="background: var(--gray-300); color: var(--gray-600); cursor: not-allowed; box-shadow: none;"' : ''}>
                            ${isAvailable ? '+ Agregar' : 'Sin Stock'}
                        </button>
                      `;

                // Formatear tag y nombre dinámicamente
                const displayTag = item.tag ? item.tag.replace(/Opción/gi, "Menú") : "Menú";
                const displayName = item.name ? item.name.replace(/Menú Ejecutivo:\s*/gi, "") : "";

                const dayClass = item.tag ? item.tag.toLowerCase().replace("ó", "o").replace(" ", "-").replace("opcion", "menu") : 'menu-1';
                const priceHtml = this.catalogType === 'corporativo'
                    ? '<div class="menu-list-price" style="color: var(--dark-muted); font-size: 0.85rem;">Incluido en Plan</div>'
                    : `<div class="menu-list-price">$${item.price.toLocaleString("es-AR")} <span>c/u</span></div>`;

                const macrosHtml = item.macros ? `
                    <div class="macro-text-row" style="font-size: 0.8rem; color: var(--gray-600); margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${item.macros.kcal ? `<span><strong>Kcal:</strong> ${item.macros.kcal}</span>` : ''}
                        ${item.macros.protein ? `<span><strong>Prot:</strong> ${item.macros.protein}g</span>` : ''}
                        ${item.macros.carbs ? `<span><strong>Carbos:</strong> ${item.macros.carbs}g</span>` : ''}
                        ${item.macros.fat ? `<span><strong>Grasas:</strong> ${item.macros.fat}g</span>` : ''}
                    </div>
                ` : '';

                return `
                    <div class="menu-list-row" style="opacity: ${isAvailable ? 1 : 0.6}">
                        <div class="menu-list-day ${dayClass}">${displayTag}</div>
                        <img class="menu-list-img" src="${imageUrl}" alt="${displayName}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'">
                        <div class="menu-list-info">
                            <h3 class="menu-list-title">${displayTag}: ${displayName}</h3>
                            <p class="menu-list-desc">${item.description}</p>
                            ${macrosHtml}
                        </div>
                        ${priceHtml}
                        <div class="menu-list-action">
                            ${qtyHtml}
                        </div>
                    </div>
                `;
            }).join("");
        } else {
            // Cuadrícula (Grid)
            container.innerHTML = filteredMenu.map(item => {
                const hasTag = item.tag && item.tag.trim() !== "";
                const isAvailable = item.available !== false && (item.stock == null || item.stock > 0);
                const imageUrl = item.image && item.image.trim() !== ""
                    ? item.image
                    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

                // Formatear tag y nombre dinámicamente
                const displayTag = item.tag ? item.tag.replace(/Opción/gi, "Menú") : "";
                const displayName = item.name ? item.name.replace(/Menú Ejecutivo:\s*/gi, "") : "";

                const priceHtml = this.catalogType === 'corporativo'
                    ? '<div class="menu-card-price" style="color: var(--dark-muted); font-size: 0.85rem;">Incluido en Plan</div>'
                    : `<div class="menu-card-price">$${item.price.toLocaleString("es-AR")} <span>c/u</span></div>`;

                const macrosHtml = item.macros ? `
                    <div class="macro-text-row" style="font-size: 0.8rem; color: var(--gray-600); margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${item.macros.kcal ? `<span><strong>Kcal:</strong> ${item.macros.kcal}</span>` : ''}
                        ${item.macros.protein ? `<span><strong>Prot:</strong> ${item.macros.protein}g</span>` : ''}
                        ${item.macros.carbs ? `<span><strong>Carbos:</strong> ${item.macros.carbs}g</span>` : ''}
                        ${item.macros.fat ? `<span><strong>Grasas:</strong> ${item.macros.fat}g</span>` : ''}
                    </div>
                ` : '';

                return `
                    <div class="menu-card" style="opacity: ${isAvailable ? 1 : 0.7}">
                        ${hasTag ? `<div class="menu-card-badge ${!isAvailable ? 'out-of-stock' : ''}">${displayTag}</div>` : ''}
                        ${!isAvailable && !hasTag ? `<div class="menu-card-badge out-of-stock">Sin Stock</div>` : ''}
                        <div class="menu-card-image-wrapper">
                            <img class="menu-card-image" src="${imageUrl}" alt="${displayName}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'">
                        </div>
                        <div class="menu-card-content">
                            <h3 class="menu-card-title">${displayTag ? `${displayTag}: ` : ''}${displayName}</h3>
                            <p class="menu-card-desc">${item.description}</p>
                            ${macrosHtml}
                            <div class="menu-card-footer">
                                ${priceHtml}
                                <button class="btn-add-cart" 
                                        onclick="app.addToCart('${item.id}')" 
                                        ${!isAvailable ? 'disabled' : ''}
                                        title="${isAvailable ? 'Agregar al carrito' : 'No disponible'}">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }

    // --- LÓGICA DEL CARRITO DE COMPRAS ---
    toggleCart() {
        const drawer = document.getElementById("cart-drawer");
        const overlay = document.getElementById("cart-drawer-overlay");

        if (drawer.classList.contains("open")) {
            this.closeCart();
        } else {
            drawer.classList.add("open");
            overlay.style.display = "block";
            this.renderCartItems();
        }
    }

    closeCart() {
        const drawer = document.getElementById("cart-drawer");
        const overlay = document.getElementById("cart-drawer-overlay");

        if (drawer && overlay) {
            drawer.classList.remove("open");
            overlay.style.display = "none";
        }
    }

    addToCart(itemId) {
        const menuItem = this.menu.find(item => item.id === itemId);
        if (!menuItem || menuItem.available === false) return;

        const cartItemIndex = this.cart.findIndex(item => item.id === itemId);

        if (cartItemIndex > -1) {
            if (menuItem.stock != null && this.cart[cartItemIndex].quantity >= menuItem.stock) {
                alert(`Solo quedan ${menuItem.stock} unidades de este menú.`);
                return;
            }
            this.cart[cartItemIndex].quantity += 1;
        } else {
            if (menuItem.stock != null && menuItem.stock <= 0) {
                alert(`Este menú se encuentra agotado.`);
                return;
            }
            this.cart.push({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                image: menuItem.image,
                quantity: 1
            });
        }

        this.updateCartUI();
        this.renderMenuGrid(); // Re-renderizar para reflejar el selector de cantidades en fila
    }

    openCartBriefly() {
        const drawer = document.getElementById("cart-drawer");
        const overlay = document.getElementById("cart-drawer-overlay");
        if (!drawer.classList.contains("open")) {
            drawer.classList.add("open");
            overlay.style.display = "block";
            this.renderCartItems();
        }
    }

    updateCartQuantity(itemId, change) {
        const cartItemIndex = this.cart.findIndex(item => item.id === itemId);
        if (cartItemIndex === -1) return;
        if (change > 0) {
            const menuItem = this.menu.find(i => i.id === itemId);
            if (menuItem && menuItem.stock != null && this.cart[cartItemIndex].quantity >= menuItem.stock) {
                alert(`Solo quedan ${menuItem.stock} unidades de este menú.`);
                return;
            }
        }

        this.cart[cartItemIndex].quantity += change;

        if (this.cart[cartItemIndex].quantity <= 0) {
            this.cart.splice(cartItemIndex, 1);
        }

        this.updateCartUI();
        this.renderCartItems();
        this.renderMenuGrid(); // Re-renderizar para actualizar el selector de cantidades en fila
    }

    updateCartUI() {
        const countBadge = document.getElementById("cart-count");
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (countBadge) {
            countBadge.innerText = totalItems;
        }

        // Actualizar botón de checkout del carrito
        const btnCheckout = document.getElementById("btn-cart-checkout");
        if (btnCheckout) {
            btnCheckout.disabled = totalItems === 0;
        }

        // Actualizar la barra flotante del carrito
        const floatingBar = document.getElementById("floating-cart-bar");
        const floatingCount = document.getElementById("floating-cart-count");
        const floatingTotal = document.getElementById("floating-cart-total");

        if (floatingBar) {
            if (totalItems > 0 && this.currentView === "client") {
                floatingBar.style.display = "flex";
                if (floatingCount) floatingCount.innerText = totalItems;
                if (floatingTotal) {
                    floatingTotal.innerText = this.catalogType === 'corporativo'
                        ? '$0'
                        : `$${subtotal.toLocaleString("es-AR")}`;
                }
            } else {
                floatingBar.style.display = "none";
            }
        }
    }

    getShippingCost() {
        const typeSelect = document.getElementById("checkout-type");
        if (typeSelect && typeSelect.value === "corporativo") {
            return 0; // Envío gratis para corporativo siempre
        }
        if (this.catalogType === "corporativo") {
            return 0;
        }
        const totalQuantity = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalQuantity >= 10) {
            return 0; // Envío gratis a partir de 10 viandas
        }
        const zoneSelect = document.getElementById("checkout-zone");
        const currentZoneId = zoneSelect ? zoneSelect.value : (this.selectedDeliveryZone || "caba");
        const zoneObj = DELIVERY_ZONES_CONFIG.find(z => z.id === currentZoneId);
        return zoneObj ? zoneObj.price : this.SHIPPING_COST;
    }

    renderCartItems() {
        const container = document.getElementById("cart-items");
        const subtotalSpan = document.getElementById("cart-subtotal");
        const totalSpan = document.getElementById("cart-total");
        const shippingSpan = document.getElementById("cart-shipping");
        const promoDiv = document.getElementById("cart-shipping-promo");

        if (!container) return;

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">${APP_ICONS.emptyCart}</div>
                    <p>Tu carrito está vacío</p>
                    <button class="btn-primary" style="margin-top: 1rem; padding: 0.6rem 1.2rem; font-size: 0.9rem;" onclick="app.toggleCart()">Explorar Platos</button>
                </div>
            `;
            subtotalSpan.innerText = "$0";
            totalSpan.innerText = "$0";
            if (shippingSpan) shippingSpan.innerText = `$${this.SHIPPING_COST}`;
            if (promoDiv) promoDiv.style.display = "none";
            return;
        }

        container.innerHTML = this.cart.map(item => {
            const imageUrl = item.image && item.image.trim() !== ""
                ? item.image
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
            const priceHtml = this.catalogType === 'corporativo'
                ? `<div class="cart-item-price" style="color: var(--dark-muted); font-size: 0.85rem;">Incluido</div>`
                : `<div class="cart-item-price">$${item.price.toLocaleString("es-AR")}</div>`;

            return `
                <div class="cart-item">
                    <img class="cart-item-img" src="${imageUrl}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        ${priceHtml}
                    </div>
                    <div class="cart-item-quantity">
                        <button class="btn-qty" onclick="app.updateCartQuantity('${item.id}', -1)">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="btn-qty" onclick="app.updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
            `;
        }).join("");

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = this.getShippingCost();
        const grandTotal = subtotal + shipping;

        if (this.catalogType === 'corporativo') {
            subtotalSpan.innerHTML = `<span style="color: var(--dark-muted); font-size: 0.9rem;">0</span>`;
            if (shippingSpan) shippingSpan.innerHTML = `<span style="color: var(--dark-muted); font-size: 0.9rem;">-</span>`;
            totalSpan.innerHTML = `<span style="color: var(--primary); font-size: 1rem;">Facturado a Empresa</span>`;
        } else {
            subtotalSpan.innerText = `$${subtotal.toLocaleString("es-AR")}`;
            if (shippingSpan) {
                shippingSpan.innerHTML = shipping === 0
                    ? `<span style="color: var(--green-success); font-weight: 700;">Gratis</span>`
                    : `$${shipping.toLocaleString("es-AR")}`;
            }
            totalSpan.innerText = `$${grandTotal.toLocaleString("es-AR")}`;
        }

        // Mostrar promoción de envío
        if (promoDiv) {
            promoDiv.style.display = "block";
            if (shipping === 0) {
                promoDiv.innerHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;">${APP_ICONS.checkCircle} <strong>¡Envío GRATIS aplicado!</strong></span>`;
                promoDiv.style.backgroundColor = "var(--green-success-light)";
                promoDiv.style.color = "var(--green-success)";
                promoDiv.style.border = "1px solid rgba(16, 185, 129, 0.2)";
            } else {
                const remaining = 10 - totalItems;
                promoDiv.innerHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;">${APP_ICONS.truck} Llevas ${totalItems} viandas. ¡Agrega ${remaining} más para envío GRATIS!</span>`;
                promoDiv.style.backgroundColor = "var(--yellow-warning-light)";
                promoDiv.style.color = "var(--yellow-warning)";
                promoDiv.style.border = "1px solid rgba(245, 158, 11, 0.2)";
            }
        }
    }

    // --- PROCESAR COMPRA (CHECKOUT) ---
    proceedToCheckout() {
        if (this.cart.length === 0) return;
        this.closeCart();
        this.showView("checkout");
        this.renderCheckoutSummary();
    }

    handleCheckoutTypeChange() {
        const typeSelect = document.getElementById("checkout-type");
        if (!typeSelect) return;

        const isParticular = typeSelect.value === "particular";

        // Toggles particular fields
        const partFields = document.getElementById("checkout-particular-fields");
        if (partFields) {
            partFields.style.display = isParticular ? "block" : "none";
            const inputs = partFields.querySelectorAll("input, select");
            inputs.forEach(input => {
                if (isParticular) {
                    input.setAttribute("required", "required");
                } else {
                    input.removeAttribute("required");
                }
            });
        }

        // Ocultar siempre el grupo de empresa porque ya se preseleccionó en el login
        const corpFields = document.getElementById("checkout-company-group");
        const companySelect = document.getElementById("checkout-company-select");
        if (corpFields) {
            corpFields.style.display = "none";
            if (companySelect) {
                companySelect.removeAttribute("required");
            }
        }

        // Actualizar costos de envío en el resumen
        this.renderCheckoutSummary();
    }

    renderCheckoutSummary() {
        const container = document.getElementById("checkout-summary-items");
        const subtotalSpan = document.getElementById("checkout-subtotal");
        const shippingSpan = document.getElementById("checkout-shipping");
        const totalSpan = document.getElementById("checkout-total");

        if (!container) return;

        container.innerHTML = this.cart.map(item => {
            const priceHtml = this.catalogType === 'corporativo'
                ? `<span style="color: var(--dark-muted); font-size: 0.85rem;">Incluido</span>`
                : `<span>$${(item.price * item.quantity).toLocaleString("es-AR")}</span>`;
            return `
                <div class="summary-item">
                    <span class="summary-item-name">${item.name} <span class="summary-item-qty">x${item.quantity}</span></span>
                    ${priceHtml}
                </div>
            `;
        }).join("");

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = this.getShippingCost();
        const grandTotal = subtotal + shipping;

        if (this.catalogType === 'corporativo') {
            subtotalSpan.innerHTML = `<span style="color: var(--dark-muted); font-size: 0.9rem;">0</span>`;
            if (shippingSpan) shippingSpan.innerHTML = `<span style="color: var(--dark-muted); font-size: 0.9rem;">-</span>`;
            totalSpan.innerHTML = `<span style="color: var(--primary); font-size: 1rem;">Facturado a Empresa</span>`;
        } else {
            subtotalSpan.innerText = `$${subtotal.toLocaleString("es-AR")}`;
            if (shippingSpan) {
                shippingSpan.innerHTML = shipping === 0
                    ? `<span style="color: var(--green-success); font-weight: 700;">Gratis</span>`
                    : `$${shipping.toLocaleString("es-AR")}`;
            }
            totalSpan.innerText = `$${grandTotal.toLocaleString("es-AR")}`;
        }
    }

    // Revisa contra Firebase que lo que hay en el carrito siga disponible, con stock y al mismo precio
    async validateCartAgainstServer() {
        try {
            const snap = await db.collection("nutriroots_data").doc("menu").get();
            if (!snap.exists || !snap.data() || !Array.isArray(snap.data().data)) return { ok: true };

            this.menu = snap.data().data;
            this.migrateMenuCategories();

            const messages = [];
            this.cart = this.cart.filter(cartItem => {
                const menuItem = this.menu.find(m => m.id === cartItem.id);
                if (!menuItem || menuItem.available === false || (menuItem.stock != null && menuItem.stock <= 0)) {
                    messages.push(`"${cartItem.name}" ya no está disponible y se quitó del pedido.`);
                    return false;
                }
                if (menuItem.stock != null && cartItem.quantity > menuItem.stock) {
                    messages.push(`De "${cartItem.name}" solo quedan ${menuItem.stock} unidades; ajustamos la cantidad.`);
                    cartItem.quantity = menuItem.stock;
                }
                if (menuItem.price !== cartItem.price) {
                    messages.push(`El precio de "${cartItem.name}" se actualizó.`);
                    cartItem.price = menuItem.price;
                }
                return true;
            });

            if (messages.length === 0) return { ok: true };

            this.updateCartUI();
            this.renderCartItems();
            this.renderMenuGrid();
            if (this.cart.length === 0) {
                alert(messages.join("\n") + "\n\nTu carrito quedó vacío. Elegí otros platos.");
                this.showView("client");
            } else {
                this.renderCheckoutSummary();
                alert(messages.join("\n") + "\n\nRevisá tu pedido y confirmalo de nuevo.");
            }
            return { ok: false };
        } catch (error) {
            console.error("No se pudo validar el carrito contra el servidor:", error);
            return { ok: true }; // Sin conexión a la validación: no bloqueamos la compra
        }
    }

    async handleCheckoutSubmit(event) {
        event.preventDefault();
        if (this._submittingOrder) return; // evita doble clic
        this._submittingOrder = true;

        const submitBtn = event.target && event.target.querySelector ? event.target.querySelector('button[type="submit"]') : null;
        if (submitBtn) submitBtn.disabled = true;

        try {
            const validation = await this.validateCartAgainstServer();
            if (!validation.ok) return;
            this.processCheckout(event);
        } finally {
            this._submittingOrder = false;
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    processCheckout(event) {
        if (this.cart.length === 0) {
            alert("Tu carrito está vacío. Vuelve a seleccionar platos.");
            this.showView("client");
            return;
        }

        const typeSelect = document.getElementById("checkout-type");
        const isParticular = typeSelect ? typeSelect.value === "particular" : true;
        const name = document.getElementById("checkout-name").value.trim();
        const companyName = !isParticular ? document.getElementById("checkout-company-select").value : "";
        const notes = document.getElementById("checkout-notes").value.trim();

        // Datos obligatorios para todos
        const phone = document.getElementById("checkout-phone").value.trim();

        // Datos condicionales de entrega/pago para particulares
        const address = isParticular ? document.getElementById("checkout-address").value.trim() : "";
        const deliveryDate = isParticular ? document.getElementById("checkout-date").value : "";
        const deliveryTime = isParticular ? document.getElementById("checkout-time").value : "";
        const paymentMethod = isParticular ? document.getElementById("checkout-payment").value : "";

        // Validar que el día de entrega sea Domingo o Lunes (sólo para particulares)
        // Eliminado temporalmente para permitir pruebas cualquier día.
        // if (isParticular && deliveryDate) {
        //     const dateObj = new Date(deliveryDate + 'T00:00:00');
        //     const dayOfWeek = dateObj.getDay(); // 0 = Domingo, 1 = Lunes
        //     if (dayOfWeek !== 0 && dayOfWeek !== 1) {
        //         alert("Las entregas solo se realizan los días Domingo o Lunes. Por favor, selecciona una fecha válida.");
        //         return;
        //     }
        // }

        // Generar un ID incremental o aleatorio único
        const orderNumber = 1000 + this.orders.length + 1;
        const uniqueSuffix = Math.floor(Math.random() * 90000) + 10000;
        const orderId = `NR-${orderNumber}-${uniqueSuffix}`;

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = this.getShippingCost();
        const total = subtotal + shipping;

        // Obtener nombre descriptivo de la zona elegida
        const zoneSelect = document.getElementById("checkout-zone");
        const selectedZoneId = zoneSelect ? zoneSelect.value : (this.selectedDeliveryZone || "caba");
        const zoneObj = DELIVERY_ZONES_CONFIG.find(z => z.id === selectedZoneId);
        const deliveryZoneName = isParticular ? (zoneObj ? zoneObj.name : "CABA") : "Corporativo";

        const newOrder = {
            id: orderId,
            customerName: name,
            companyName: companyName,
            phone: phone,
            address: address,
            deliveryZone: deliveryZoneName,
            deliveryDate: deliveryDate,
            deliveryTime: deliveryTime,
            paymentMethod: paymentMethod,
            items: this.cart.map(item => ({
                id: item.id,
                name: item.name,
                tag: item.tag || "",
                description: item.description || "",
                price: item.price,
                quantity: item.quantity
            })),
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            status: "pendiente",
            notes: notes,
            createdAt: new Date().toISOString()
        };

        // Guardar pedido en base de datos
        this.orders.push(newOrder);
        // Guardar individualmente en Firebase
        if (typeof db !== 'undefined') {
            db.collection("orders").doc(newOrder.id).set(newOrder).catch(console.error);
        }
        this.backupOrder(newOrder);
        this.saveOrdersToLocalStorage();

        // Descontar stock de los items comprados: se toca SOLO el stock en Firebase,
        // sin reescribir el resto del menú con la copia (posiblemente vieja) de este cliente.
        const purchased = this.cart.map(c => ({ id: c.id, quantity: c.quantity }));
        const hasLimitedStock = purchased.some(p => {
            const m = this.menu.find(i => i.id === p.id);
            return m && m.stock != null;
        });
        if (hasLimitedStock) {
            this.updateMenuRemote(menu => {
                purchased.forEach(p => {
                    const m = menu.find(i => i.id === p.id);
                    if (m && m.stock != null) m.stock = Math.max(0, m.stock - p.quantity);
                });
                return menu;
            }, { history: false }).then(() => this.renderMenuGrid());
        }


        // Guardar pedido como último pedido y preparar resumen en pantalla de éxito
        this.lastOrder = newOrder;
        sessionStorage.setItem("nr_last_order", JSON.stringify(newOrder));
        this.renderSuccessView(newOrder);

        // Limpiar carrito
        this.cart = [];
        this.updateCartUI();
        document.getElementById("checkout-form").reset();

        // Mostrar pantalla de éxito
        this.showView("success");
    }

    renderSuccessView(order) {
        if (!order) return;

        // Código de Pedido
        const orderIdEl = document.getElementById("success-order-id");
        if (orderIdEl) {
            orderIdEl.innerText = `#${order.id}`;
        }

        // Listado de ítems pedidos
        const itemsContainer = document.getElementById("success-order-items");
        if (itemsContainer && Array.isArray(order.items)) {
            const isCorp = order.companyName || this.catalogType === "corporativo";
            itemsContainer.innerHTML = order.items.map(item => {
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                const priceHtml = isCorp
                    ? `<span style="color: var(--dark-muted); font-size: 0.85rem;">Menú Corporativo</span>`
                    : `<strong>$${itemTotal.toLocaleString("es-AR")}</strong>`;

                return `
                    <div class="success-item-row">
                        <div style="display: flex; align-items: center;">
                            <span class="success-item-qty">${item.quantity}x</span>
                            <span class="success-item-name">${this.escapeHtml(item.name)}</span>
                        </div>
                        <div>${priceHtml}</div>
                    </div>
                `;
            }).join("");
        }

        // Totales y Costos
        const subtotalEl = document.getElementById("success-subtotal");
        const shippingEl = document.getElementById("success-shipping");
        const totalEl = document.getElementById("success-total");
        const subtotalRow = document.getElementById("success-subtotal-row");
        const shippingRow = document.getElementById("success-shipping-row");

        const isCorp = order.companyName || this.catalogType === "corporativo";
        if (isCorp) {
            if (subtotalRow) subtotalRow.style.display = "none";
            if (shippingRow) shippingRow.style.display = "none";
            if (totalEl) totalEl.innerHTML = `<span style="color: var(--primary); font-size: 1rem;">Facturado a Empresa (${this.escapeHtml(order.companyName || 'Corporativo')})</span>`;
        } else {
            if (subtotalRow) subtotalRow.style.display = "flex";
            if (shippingRow) shippingRow.style.display = "flex";
            if (subtotalEl) subtotalEl.innerText = `$${(order.subtotal || 0).toLocaleString("es-AR")}`;
            if (shippingEl) {
                const shippingVal = order.shipping || 0;
                shippingEl.innerHTML = shippingVal === 0
                    ? `<span style="color: var(--green-success); font-weight: 700;">Gratis</span>`
                    : `$${shippingVal.toLocaleString("es-AR")}`;
            }
            if (totalEl) totalEl.innerText = `$${(order.total || 0).toLocaleString("es-AR")}`;
        }

        // Datos del Cliente y Entrega
        const detailsContainer = document.getElementById("success-order-details");
        if (detailsContainer) {
            let detailsHtml = `
                <div class="success-detail-item">
                    <span class="success-detail-label">Cliente</span>
                    <span class="success-detail-val">${this.escapeHtml(order.customerName || '-')}</span>
                </div>
                <div class="success-detail-item">
                    <span class="success-detail-label">Teléfono</span>
                    <span class="success-detail-val">${this.escapeHtml(order.phone || 'No especificado')}</span>
                </div>
            `;

            if (order.companyName) {
                detailsHtml += `
                    <div class="success-detail-item">
                        <span class="success-detail-label">Empresa</span>
                        <span class="success-detail-val">${this.escapeHtml(order.companyName)}</span>
                    </div>
                `;
            }

            if (order.deliveryZone) {
                detailsHtml += `
                    <div class="success-detail-item">
                        <span class="success-detail-label">Zona de Entrega</span>
                        <span class="success-detail-val">${this.escapeHtml(order.deliveryZone)}</span>
                    </div>
                `;
            }

            if (order.address) {
                detailsHtml += `
                    <div class="success-detail-item">
                        <span class="success-detail-label">Dirección de Entrega</span>
                        <span class="success-detail-val">${this.escapeHtml(order.address)}</span>
                    </div>
                `;
            }

            if (order.deliveryDate) {
                let dateDisplay = order.deliveryDate;
                try {
                    dateDisplay = new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString("es-AR", {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    });
                } catch (e) {
                    dateDisplay = order.deliveryDate;
                }
                detailsHtml += `
                    <div class="success-detail-item">
                        <span class="success-detail-label">Fecha de Entrega</span>
                        <span class="success-detail-val" style="text-transform: capitalize;">${dateDisplay}</span>
                    </div>
                `;
            }

            if (order.deliveryTime) {
                detailsHtml += `
                    <div class="success-detail-item">
                        <span class="success-detail-label">Franja Horaria</span>
                        <span class="success-detail-val">${this.escapeHtml(order.deliveryTime)}</span>
                    </div>
                `;
            }

            if (order.paymentMethod) {
                detailsHtml += `
                    <div class="success-detail-item">
                        <span class="success-detail-label">Medio de Pago</span>
                        <span class="success-detail-val">${this.escapeHtml(order.paymentMethod)}</span>
                    </div>
                `;
            }

            if (order.notes) {
                detailsHtml += `
                    <div class="success-detail-item" style="grid-column: 1 / -1;">
                        <span class="success-detail-label">Notas / Aclaraciones</span>
                        <span class="success-detail-val" style="font-style: italic;">"${this.escapeHtml(order.notes)}"</span>
                    </div>
                `;
            }

            detailsContainer.innerHTML = detailsHtml;
        }
    }

    generateWhatsAppLink(order) {
        const baseUrl = "https://api.whatsapp.com/send";

        let message = `*¡Hola! Realicé un pedido en NutriRoots (Código: ${order.id})* 🌱\n\n`;
        message += `*Cliente:* ${order.customerName}\n`;
        if (order.companyName) {
            message += `*Empresa:* ${order.companyName}\n`;
        }
        if (order.phone) {
            message += `*Teléfono:* ${order.phone}\n`;
        }
        if (order.deliveryZone) {
            message += `*Zona de Entrega:* ${order.deliveryZone}\n`;
        }
        if (order.address) {
            message += `*Dirección:* ${order.address}\n`;
        }
        if (order.deliveryDate) {
            const dateFormatted = new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString("es-AR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            message += `*Día de Entrega:* ${dateFormatted}\n`;
        }
        if (order.deliveryTime) {
            message += `*Horario:* ${order.deliveryTime}\n`;
        }
        if (order.paymentMethod) {
            message += `*Pago:* ${order.paymentMethod}\n`;
        }
        if (order.notes) {
            message += `*Notas/Aclaraciones:* _${order.notes}_\n`;
        }
        message += `\n*--- DETALLE DEL PEDIDO ---*\n`;

        order.items.forEach(item => {
            if (this.catalogType === 'corporativo') {
                message += `• ${item.quantity}x ${item.name}\n`;
            } else {
                message += `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-AR")})\n`;
            }
        });

        if (this.catalogType !== 'corporativo') {
            message += `\n*Envío:* ${order.shipping === 0 ? 'Gratis' : `$${order.shipping.toLocaleString("es-AR")}`}\n`;
            message += `*TOTAL A PAGAR: $${order.total.toLocaleString("es-AR")}*\n\n`;
        } else {
            message += `\n*(Pedido Corporativo - Abonado por Empresa)*\n\n`;
        }
        message += `Por favor, confirmame la recepción y pasame los detalles para completar el pedido. ¡Muchas gracias!`;

        const encodedText = encodeURIComponent(message);
        return `${baseUrl}?phone=${this.WHATSAPP_NUMBER}&text=${encodedText}`;
    }

    // --- LÓGICA DE ADMINISTRACIÓN ---
    switchAdminTab(tabName) {
        this.currentAdminTab = tabName;

        // Quitar clase active
        document.getElementById("side-orders-btn").classList.remove("active");
        document.getElementById("side-menu-btn").classList.remove("active");
        const sideCompaniesBtn = document.getElementById("side-companies-btn");
        if (sideCompaniesBtn) sideCompaniesBtn.classList.remove("active");

        // Ocultar tabs
        document.getElementById("admin-tab-orders").style.display = "none";
        document.getElementById("admin-tab-menu").style.display = "none";
        const tabCompanies = document.getElementById("admin-tab-companies");
        if (tabCompanies) tabCompanies.style.display = "none";

        // Mostrar tab activo y destacar en sidebar
        if (tabName === "orders") {
            document.getElementById("side-orders-btn").classList.add("active");
            document.getElementById("admin-tab-orders").style.display = "block";
            this.renderOrdersTable();
        } else if (tabName === "menu") {
            document.getElementById("side-menu-btn").classList.add("active");
            document.getElementById("admin-tab-menu").style.display = "block";
            this.renderMenuEditor();
        } else if (tabName === "companies") {
            if (sideCompaniesBtn) sideCompaniesBtn.classList.add("active");
            if (tabCompanies) tabCompanies.style.display = "block";
            this.renderCompaniesTable();
        }
    }

    getCustomViandaPrice(companyName, originalPrice) {
        if (!companyName) return originalPrice;
        const normalized = companyName.trim().toLowerCase();
        if (normalized === 'orensano' || normalized === 'ayr') {
            return 7600;
        }
        return originalPrice;
    }

    updateAdminStats() {
        const totalRevenueSpan = document.getElementById("stat-revenue");
        const totalOrdersSpan = document.getElementById("stat-orders-count");
        const pendingSpan = document.getElementById("stat-pending-count");
        const viandasSpan = document.getElementById("stat-viandas-count");
        const menuBreakdownContainer = document.getElementById("stat-menu-breakdown");

        if (!totalRevenueSpan) return;

        // Calcular ganancias solo de pedidos entregados o activos (no cancelados)
        const validOrders = this.orders.filter(order => order.status !== "cancelado");
        let totalRevenue = 0;
        let viandasBreakdown = {};
        let menuBreakdown = {};
        let totalViandasToCook = 0;

        validOrders.forEach(order => {
            let orderTotal = 0;
            const type = order.companyName ? order.companyName.trim() : "Particular";

            if (!viandasBreakdown[type]) {
                viandasBreakdown[type] = 0;
            }

            order.items.forEach(item => {
                const cPrice = this.getCustomViandaPrice(order.companyName, item.price);
                orderTotal += cPrice * item.quantity;
                viandasBreakdown[type] += item.quantity;

                // Popularidad de menus: usar el nombre del plato
                let displayTag = item.name ? item.name.replace(/Menú Ejecutivo:\s*/gi, "").trim() : "Plato Desconocido";
                totalViandasToCook += item.quantity;

                if (!menuBreakdown[displayTag]) {
                    menuBreakdown[displayTag] = 0;
                }
                menuBreakdown[displayTag] += item.quantity;
            });
            orderTotal += order.shipping || 0;
            totalRevenue += orderTotal;
        });

        const totalOrdersCount = this.orders.length;

        // Pedidos que requieren acción (pendiente o en cocina)
        const pendingCount = this.orders.filter(order => order.status === "pendiente" || order.status === "en_cocina").length;

        totalRevenueSpan.innerText = `$${totalRevenue.toLocaleString("es-AR")}`;
        totalOrdersSpan.innerText = totalOrdersCount;
        pendingSpan.innerText = pendingCount;

        const totalViandasSpan = document.getElementById("stat-total-viandas-count");
        if (totalViandasSpan) totalViandasSpan.innerText = totalViandasToCook;

        if (viandasSpan) {
            if (Object.keys(viandasBreakdown).length > 0) {
                const breakdownHtml = Object.keys(viandasBreakdown).map(k => {
                    return `<div style="display:flex; justify-content:space-between; border-bottom: 1px dashed var(--gray-200); padding-bottom: 0.15rem; margin-bottom: 0.15rem; font-size: 0.85rem; color: var(--dark-muted);">
                                <span>${this.escapeHtml(k)}</span> <span style="font-weight:700; color:var(--dark);">${viandasBreakdown[k]}</span>
                            </div>`;
                }).join('');
                viandasSpan.innerHTML = `<div style="margin-top: 0.5rem;">${breakdownHtml}</div>`;
            } else {
                viandasSpan.innerHTML = "<div style='font-size:0.85rem; color:var(--gray-400); margin-top: 0.5rem;'>Sin datos</div>";
            }
        }

        if (menuBreakdownContainer) {
            if (Object.keys(menuBreakdown).length > 0) {
                // Sort by menu number
                const sortedMenus = Object.keys(menuBreakdown).sort((a, b) => {
                    const numA = parseInt(a.replace(/\D/g, "")) || 0;
                    const numB = parseInt(b.replace(/\D/g, "")) || 0;
                    return numA - numB;
                });

                const maxQty = Math.max(...Object.values(menuBreakdown));

                const breakdownHtml = sortedMenus.map(menuTag => {
                    const qty = menuBreakdown[menuTag];
                    const percentage = Math.max(5, (qty / maxQty) * 100);
                    return `
                        <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                                <span style="font-weight: 700; color: var(--dark);">${this.escapeHtml(menuTag)}</span>
                                <span style="font-weight: 600; color: var(--primary);">${qty} unidades</span>
                            </div>
                            <div style="width: 100%; height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden;">
                                <div style="width: ${percentage}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
                            </div>
                        </div>
                    `;
                }).join("");

                menuBreakdownContainer.innerHTML = breakdownHtml;
            } else {
                menuBreakdownContainer.innerHTML = "<div style='color: var(--gray-400); font-size: 0.9rem;'>No hay ventas registradas.</div>";
            }
        }
    }

    filterOrders(status, buttonElement) {
        this.currentOrderFilter = status;

        // Cambiar botón activo en el filtro
        buttonElement.parentElement.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });
        buttonElement.classList.add("active");

        this.renderOrdersTable();
    }

    renderOrdersTable() {
        const tbody = document.getElementById("orders-table-body");
        if (!tbody) return;

        const filteredOrders = this.currentOrderFilter === "all"
            ? this.orders
            : this.orders.filter(order => order.status === this.currentOrderFilter);

        // Ordenar por fecha de creación descendente (más recientes primero)
        filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (filteredOrders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--dark-muted);">No se encontraron pedidos.</td></tr>`;
            return;
        }

        tbody.innerHTML = filteredOrders.map(order => {
            const itemsSummary = order.items.map(item => {
                const menuItem = this.menu.find(m => m.id === item.id);
                const rawTag = item.tag || (menuItem ? menuItem.tag : "");
                const displayTag = rawTag ? rawTag.replace(/Opción/gi, "Menú") : "Menú";
                const rawName = item.name || "";
                const displayName = rawName.replace(/Menú Ejecutivo:\s*/gi, "");
                const itemDescription = item.description || (menuItem ? menuItem.description : "");

                return `
                    <div style="border-bottom: 1px dashed var(--gray-200); padding: 0.35rem 0; font-size: 0.85rem; line-height: 1.3;">
                        <div style="display: flex; justify-content: space-between; gap: 1.5rem; align-items: baseline;">
                            <span style="font-weight: 700; color: var(--primary); text-align: left;">${this.escapeHtml(displayTag)}: ${this.escapeHtml(displayName)}</span>
                            <span style="font-weight: 700; color: var(--dark); text-align: right; white-space: nowrap; font-size: 0.9rem;">x${item.quantity}</span>
                        </div>
                        ${itemDescription ? `<div style="font-size: 0.76rem; color: var(--gray-500); margin-top: 0.15rem; text-align: left; line-height: 1.25;">${this.escapeHtml(itemDescription)}</div>` : ""}
                    </div>
                `;
            }).join("");
            const dateFormatted = new Date(order.createdAt).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });

            let calculatedTotal = 0;
            order.items.forEach(item => {
                calculatedTotal += this.getCustomViandaPrice(order.companyName, item.price) * item.quantity;
            });
            calculatedTotal += order.shipping || 0;

            return `
                <tr>
                    <td style="font-weight: 700; color: var(--primary);">${this.escapeHtml(order.id)}</td>
                    <td>
                        <div style="font-weight: 600; font-size: 0.95rem;">${this.escapeHtml(order.customerName)}</div>
                    </td>
                    <td>
                        ${order.companyName
                    ? `<span style="font-size: 0.85rem; font-weight: 600; color: var(--primary); display: flex; align-items: center;">${APP_ICONS.company} ${this.escapeHtml(order.companyName)}</span>`
                    : `<span style="font-size: 0.8rem; color: var(--gray-500); display: flex; align-items: center; font-style: italic;">${APP_ICONS.user} Cliente Particular</span>`}
                    </td>
                    <td style="font-size: 0.85rem; line-height: 1.3; vertical-align: top;">${itemsSummary}</td>
                    <td style="font-size: 0.85rem; line-height: 1.3; max-width: 200px; word-break: break-word;" title="${this.escapeHtml(order.notes || '')}">
                        ${order.notes ? `_${this.escapeHtml(order.notes)}_` : '<span style="color: var(--gray-400);">Sin aclaraciones</span>'}
                    </td>
                    <td style="font-weight: 700;">$${calculatedTotal.toLocaleString("es-AR")}</td>
                    <td>
                        <span class="status-badge ${order.status}">${this.translateStatus(order.status)}</span>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <select class="status-select" onchange="app.changeOrderStatus('${order.id}', this.value)">
                                <option value="pendiente" ${order.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="en_cocina" ${order.status === 'en_cocina' ? 'selected' : ''}>En Cocina</option>
                                <option value="entregado" ${order.status === 'entregado' ? 'selected' : ''}>Entregado</option>
                                <option value="cancelado" ${order.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                            </select>
                            <button class="btn-icon edit" onclick="app.openOrderModal('${order.id}')" title="Editar Pedido">${APP_ICONS.edit}</button>
                            <button class="btn-icon delete" onclick="app.deleteOrder('${order.id}')" title="Eliminar Pedido">${APP_ICONS.delete}</button>
                            ${order.phone ? `<button class="btn-icon whatsapp" onclick="app.sendWhatsAppConfirmation('${order.id}')" title="Enviar WhatsApp al Cliente">${APP_ICONS.whatsapp}</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }
    translateStatus(status) {
        const statuses = {
            "pendiente": "Pendiente",
            "en_cocina": "En Cocina",
            "entregado": "Entregado",
            "cancelado": "Cancelado"
        };
        return statuses[status] || status;
    }

    exportOrdersToCSV() {
        const filteredOrders = this.currentOrderFilter === "all"
            ? this.orders
            : this.orders.filter(order => order.status === this.currentOrderFilter);

        if (filteredOrders.length === 0) {
            alert("No hay pedidos para exportar.");
            return;
        }

        // CSV Header
        const headers = ["0", "#", "Nro de Pedido", "MENU", "Descripcion del menu", "CLIENTE", "Whastapp", "nombre y apellido", "Precio", "fecha de pedido", "Nota adicional", "ORDEN", "Localidad", "Direccion de enrtrega"];

        // CSV Rows
        const rows = [];
        let orderIndexCounter = 1;

        // Invertimos la lista si se necesita, pero filteredOrders ya suele venir ordenada
        // Iteramos los pedidos
        filteredOrders.forEach(order => {
            const dateObj = new Date(order.createdAt);
            const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear().toString().slice(-2)}`;
            const nroPedido = orderIndexCounter++;

            // Iterar cada ítem del pedido
            order.items.forEach(item => {
                const menuItem = this.menu.find(m => m.id === item.id);
                const rawTag = item.tag || (menuItem ? menuItem.tag : "");
                let displayTag = rawTag ? rawTag.replace(/Opción/gi, "Menu") : "Menu";
                displayTag = displayTag.replace(/Menú/gi, "Menu");

                const displayName = item.name ? item.name.replace(/Menú Ejecutivo:\s*/gi, "").trim() : "";
                const orderNum = displayTag.replace(/\D/g, "");

                // Generar una fila por cada unidad (ej. si pide 2 del mismo plato, genera 2 filas)
                for (let i = 0; i < item.quantity; i++) {
                    const row = [
                        "P0",
                        "", // Columna #
                        nroPedido,
                        displayTag,
                        displayName,
                        "Accepted",
                        "Whastapp", // Escrito exactamente como en el ejemplo
                        order.customerName,
                        `$${this.getCustomViandaPrice(order.companyName, item.price).toLocaleString("es-AR")}`,
                        dateStr,
                        order.notes ? order.notes : "Nota adicional",
                        orderNum,
                        order.companyName || "", // Usamos Empresa como localidad si existe
                        order.address || ""
                    ];

                    const formattedRow = row.map(val => {
                        let cell = val === null || val === undefined ? '' : String(val);
                        // Evita que Excel ejecute fórmulas si un cliente escribe =, +, - o @ al inicio
                        if (/^[=+\-@\t\r]/.test(cell)) cell = "'" + cell;
                        cell = cell.replace(/"/g, '""');
                        // Cambiamos la búsqueda para que detecte el punto y coma (;)
                        if (cell.search(/("|\n|;)/g) >= 0) {
                            cell = `"${cell}"`;
                        }
                        return cell;
                    });

                    rows.push(formattedRow);
                }
            });
        });

        // Generar archivo UTF-8 CSV con BOM usando punto y coma (;)
        const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `pedidos_nutriroots_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    sendWhatsAppConfirmation(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order || !order.phone) {
            alert("Este pedido no tiene un número de teléfono registrado.");
            return;
        }

        let message = `*¡Hola ${order.customerName}!* Recibimos tu pedido (Código: ${order.id}) en nuestro Portal de Viandas. 🥕\n\n`;
        message += `*Detalle de tu Pedido:*\n`;
        order.items.forEach(item => {
            const menuItem = this.menu.find(m => m.id === item.id);
            const rawTag = item.tag || (menuItem ? menuItem.tag : "");
            const displayTag = rawTag ? rawTag.replace(/Opción/gi, "Menú") : "Menú";
            const displayName = item.name ? item.name.replace(/Menú Ejecutivo:\s*/gi, "") : "";
            message += `• ${item.quantity}x ${displayTag}: ${displayName}\n`;
        });

        if (!order.companyName) {
            message += `\n*Total a abonar:* $${order.total.toLocaleString("es-AR")}\n`;
        } else {
            message += `\n*(Pedido Corporativo - Abonado por Empresa)*\n`;
        }

        if (order.deliveryDate) {
            const dateFormatted = new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString("es-AR", { weekday: 'long', day: 'numeric', month: 'long' });
            message += `*Día de Entrega:* ${dateFormatted} (${order.deliveryTime})\n`;
        }
        if (order.address) {
            message += `*Dirección de Entrega:* ${order.address}\n`;
        }

        if (!order.companyName && order.paymentMethod) {
            message += `*Método de Pago:* ${order.paymentMethod}\n\n`;
        } else {
            message += `\n`;
        }

        message += `Tu pedido ya se encuentra registrado y en preparación. ¡Muchas gracias por elegirnos!`;

        const encodedText = encodeURIComponent(message);
        const waPhone = this.normalizePhoneForWhatsApp(order.phone);
        if (!waPhone) {
            alert("El teléfono de este pedido no es válido para WhatsApp.");
            return;
        }
        window.open(`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodedText}`, '_blank');
    }

    changeOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            // Guardar individualmente en Firebase
            if (typeof db !== 'undefined') {
                db.collection("orders").doc(orderId).update({ status: newStatus }).catch(console.error);
            }
            this.backupOrder(order);
            this.saveOrdersToLocalStorage();
            this.updateAdminStats();
            this.renderOrdersTable();
        }
    }

    openOrderModal(orderId) {
        const modal = document.getElementById("order-modal");
        const order = this.orders.find(o => o.id === orderId);
        if (!order || !modal) return;

        document.getElementById("order-id-field").value = order.id;
        document.getElementById("order-customerName").value = order.customerName;
        document.getElementById("order-phone").value = order.phone || "";
        document.getElementById("order-status").value = order.status;
        document.getElementById("order-notes").value = order.notes || "";

        // Cargar y mostrar/ocultar el campo de empresa
        const companyGroup = document.getElementById("order-companyName-group");
        const companyInput = document.getElementById("order-companyName");
        if (companyGroup && companyInput) {
            if (this.activeCompany === "corporativo") {
                companyGroup.style.display = "block";
                companyInput.value = order.companyName || "";
            } else {
                companyGroup.style.display = "none";
                companyInput.value = "";
            }
        }

        // Cargar y mostrar/ocultar los detalles de entrega de particular
        const detailsContainer = document.getElementById("order-particular-details");
        if (detailsContainer) {
            const hasParticularDetails = order.phone || order.address || order.deliveryDate || order.deliveryTime || order.paymentMethod;
            if (hasParticularDetails) {
                detailsContainer.style.display = "block";
                const dateFormatted = order.deliveryDate ? new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString("es-AR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "";

                detailsContainer.innerHTML = `
                    <div style="font-weight: 700; color: var(--primary); margin-bottom: 0.4rem; border-bottom: 1px solid var(--primary-light); padding-bottom: 0.4rem; display: flex; align-items: center;">${APP_ICONS.package} Detalles de Entrega y Pago</div>
                    <div style="margin-bottom: 0.15rem;"><strong>Zona:</strong> ${this.escapeHtml(order.deliveryZone || 'CABA')}</div>
                    <div style="margin-bottom: 0.15rem;"><strong>Teléfono:</strong> ${this.escapeHtml(order.phone || 'N/A')}</div>
                    <div style="margin-bottom: 0.15rem;"><strong>Dirección:</strong> ${this.escapeHtml(order.address || 'N/A')}</div>
                    <div style="margin-bottom: 0.15rem;"><strong>Fecha:</strong> ${dateFormatted || 'N/A'}</div>
                    <div style="margin-bottom: 0.15rem;"><strong>Horario:</strong> ${this.escapeHtml(order.deliveryTime || 'N/A')}</div>
                    <div><strong>Método de Pago:</strong> ${this.escapeHtml(order.paymentMethod || 'N/A')}</div>
                `;
            } else {
                detailsContainer.style.display = "none";
                detailsContainer.innerHTML = "";
            }
        }

        // Cargar platos y preparar edición interactiva
        this.editingOrder = order;
        this.editingOrderItems = (order.items || []).map(item => ({ ...item }));
        this.editingOrderShipping = typeof order.shipping === 'number' ? order.shipping : 0;

        this.populateOrderAddDishSelect();
        this.renderOrderItemsEdit();

        modal.style.display = "flex";
    }

    populateOrderAddDishSelect() {
        const select = document.getElementById("order-add-dish-select");
        if (!select) return;

        let optionsHtml = '<option value="">-- Seleccionar plato para agregar --</option>';
        this.menu.forEach(dish => {
            optionsHtml += `<option value="${this.escapeHtml(dish.id)}">${this.escapeHtml(dish.name)} ($${(dish.price || 0).toLocaleString("es-AR")})</option>`;
        });
        select.innerHTML = optionsHtml;
    }

    renderOrderItemsEdit() {
        const container = document.getElementById("order-items-edit-list");
        const subtotalEl = document.getElementById("order-edit-subtotal");
        const shippingEl = document.getElementById("order-edit-shipping");
        const totalEl = document.getElementById("order-edit-total");

        if (!container) return;

        if (!this.editingOrderItems || this.editingOrderItems.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: var(--dark-muted); padding: 1rem 0; font-size: 0.88rem;">No hay platos en este pedido. Puedes agregar uno usando el selector de abajo.</div>`;
        } else {
            container.innerHTML = this.editingOrderItems.map(item => {
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                return `
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px dashed var(--gray-200);">
                        <div style="flex-grow: 1; min-width: 0;">
                            <div style="font-weight: 600; font-size: 0.9rem; color: var(--dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${this.escapeHtml(item.name)}">$1${this.escapeHtml(item.name)}$2; color: var(--dark-muted);">
                                $${(item.price || 0).toLocaleString("es-AR")} c/u
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.35rem;">
                            <button type="button" onclick="app.updateOrderEditItemQty('${item.id}', -1)" style="width: 26px; height: 26px; border: 1px solid var(--gray-300); background: var(--white); border-radius: 4px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                            <span style="font-weight: 700; min-width: 22px; text-align: center; font-size: 0.9rem;">${item.quantity}</span>
                            <button type="button" onclick="app.updateOrderEditItemQty('${item.id}', 1)" style="width: 26px; height: 26px; border: 1px solid var(--gray-300); background: var(--white); border-radius: 4px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                        </div>
                        <div style="font-weight: 700; font-size: 0.9rem; color: var(--dark); min-width: 75px; text-align: right;">
                            $${itemTotal.toLocaleString("es-AR")}
                        </div>
                        <button type="button" class="btn-icon delete" onclick="app.removeOrderEditItem('${item.id}')" title="Quitar este plato" style="width: 26px; height: 26px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;">${APP_ICONS.delete}</button>
                    </div>
                `;
            }).join("");
        }

        const subtotal = (this.editingOrderItems || []).reduce((acc, it) => acc + ((it.price || 0) * (it.quantity || 1)), 0);
        const shipping = typeof this.editingOrderShipping === 'number' ? this.editingOrderShipping : 0;
        const total = subtotal + shipping;

        if (subtotalEl) subtotalEl.innerText = `$${subtotal.toLocaleString("es-AR")}`;
        if (shippingEl) shippingEl.innerText = shipping === 0 ? "Gratis" : `$${shipping.toLocaleString("es-AR")}`;
        if (totalEl) totalEl.innerText = `$${total.toLocaleString("es-AR")}`;
    }

    updateOrderEditItemQty(itemId, change) {
        if (!this.editingOrderItems) return;
        const item = this.editingOrderItems.find(it => it.id === itemId);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            this.removeOrderEditItem(itemId);
        } else {
            this.renderOrderItemsEdit();
        }
    }

    removeOrderEditItem(itemId) {
        if (!this.editingOrderItems) return;
        this.editingOrderItems = this.editingOrderItems.filter(it => it.id !== itemId);
        this.renderOrderItemsEdit();
    }

    addDishToOrderEdit() {
        const select = document.getElementById("order-add-dish-select");
        if (!select || !select.value) {
            alert("Por favor selecciona un plato de la lista para agregarlo al pedido.");
            return;
        }

        const dishId = select.value;
        const dish = this.menu.find(d => d.id === dishId);
        if (!dish) return;

        if (!this.editingOrderItems) this.editingOrderItems = [];

        const existing = this.editingOrderItems.find(it => it.id === dishId);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.editingOrderItems.push({
                id: dish.id,
                name: dish.name,
                tag: dish.tag || "",
                description: dish.description || "",
                price: dish.price || 0,
                quantity: 1
            });
        }

        select.value = "";
        this.renderOrderItemsEdit();
    }

    closeOrderModal() {
        const modal = document.getElementById("order-modal");
        if (modal) modal.style.display = "none";
        this.editingOrder = null;
        this.editingOrderItems = [];
    }

    handleOrderSubmit(event) {
        event.preventDefault();

        const id = document.getElementById("order-id-field").value;
        const name = document.getElementById("order-customerName").value.trim();
        const companyName = this.activeCompany === "corporativo"
            ? document.getElementById("order-companyName").value.trim()
            : "";
        const phone = document.getElementById("order-phone").value.trim();
        const status = document.getElementById("order-status").value;
        const notes = document.getElementById("order-notes").value.trim();

        const order = this.orders.find(o => o.id === id);
        if (order) {
            order.customerName = name;
            order.companyName = companyName;
            order.phone = phone;
            order.status = status;
            order.notes = notes;

            // Actualizar lista de platos y recalcular totales
            if (this.editingOrderItems) {
                order.items = this.editingOrderItems.map(it => ({ ...it }));
                const subtotal = order.items.reduce((acc, it) => acc + ((it.price || 0) * (it.quantity || 1)), 0);
                order.subtotal = subtotal;
                order.total = subtotal + (order.shipping || 0);
            }

            // Guardar individualmente en Firebase
            if (typeof db !== 'undefined') {
                db.collection("orders").doc(id).set({
                    customerName: order.customerName,
                    companyName: order.companyName || "",
                    phone: order.phone,
                    status: order.status,
                    notes: order.notes,
                    items: order.items || [],
                    subtotal: order.subtotal || 0,
                    total: order.total || 0
                }, { merge: true }).catch(console.error);
                this.backupOrder(order);
            }

            this.saveOrdersToLocalStorage();
            this.updateAdminStats();
            this.renderOrdersTable();
            this.closeOrderModal();
        }
    }

    deleteOrder(orderId) {
        if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el pedido ${orderId}?`)) {
            // El pedido se borra de la lista pero queda en el respaldo marcado como eliminado
            const toDelete = this.orders.find(o => o.id === orderId);
            if (toDelete) this.backupOrder(toDelete, { deletedAt: new Date().toISOString() });
            this.orders = this.orders.filter(o => o.id !== orderId);

            // Eliminar individualmente de Firebase
            if (typeof db !== 'undefined') {
                db.collection("orders").doc(orderId).delete().catch(console.error);
            }

            this.saveOrdersToLocalStorage();
            this.updateAdminStats();
            this.renderOrdersTable();
        }
    }

    // --- GESTIÓN DE EDICIÓN DEL MENÚ ---
    renderMenuEditor() {
        const grid = document.getElementById("menu-editor-grid");
        if (!grid) return;

        if (!this.menu || this.menu.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: var(--gray-50); border: 2px dashed var(--gray-300); border-radius: var(--radius-md);">
                    <div style="font-size: 2.2rem; margin-bottom: 0.6rem;">🍽️</div>
                    <h4 style="font-weight: 700; color: var(--dark); font-size: 1.1rem; margin-bottom: 0.4rem;">Base de datos de menús vacía</h4>
                    <p style="color: var(--dark-muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.2rem auto;">No hay ningún plato cargado en el sistema. Puedes comenzar a cargar tus viandas reales haciendo clic en el botón a continuación.</p>
                    <button class="btn-primary" onclick="app.openMenuModal()" style="font-size: 0.9rem; padding: 0.6rem 1.4rem;">
                        + Agregar Primer Plato
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.menu.map(item => {
            const imageUrl = item.image && item.image.trim() !== ""
                ? item.image
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
            return `
                <div class="menu-editor-card" style="border-left: 4px solid ${item.available ? 'var(--green-success)' : 'var(--gray-300)'}">
                    <div style="display: flex; gap: 0.8rem; align-items: center;">
                        <img src="${imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'">
                        <div style="flex-grow: 1; min-width: 0;">
                            <h4 style="font-size: 0.95rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h4>
                            <div style="font-size: 0.8rem; color: var(--dark-muted);">${item.category}</div>
                            <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary); margin-top: 0.1rem;">$${item.price.toLocaleString("es-AR")}</div>
                        </div>
                    </div>
                    
                    <div class="menu-editor-actions">
                        <div style="margin-right: auto; display: flex; align-items: center; gap: 0.3rem;">
                            <span style="font-size: 0.75rem; color: var(--dark-muted); font-weight: 600;">Disp:</span>
                            <input type="checkbox" ${item.available ? 'checked' : ''} onchange="app.toggleItemAvailability('${item.id}', this.checked)" style="cursor: pointer;">
                        </div>
                        <button class="btn-icon edit" onclick="app.openMenuModal('${item.id}')" title="Editar">${APP_ICONS.edit}</button>
                        <button class="btn-icon delete" onclick="app.deleteMenuItem('${item.id}')" title="Eliminar">${APP_ICONS.delete}</button>
                    </div>
                </div>
            `;
        }).join("");
    }

    clearAllMenus() {
        if (confirm("¿Estás seguro de que deseas vaciar TODOS los menús? La lista quedará en 0 platos.")) {
            this.backupMenu(this.menu, true); // copia de seguridad del menú actual antes de vaciarlo
            this.menu = [];
            this.saveMenuToLocalStorage();
            this.renderMenuEditor();
            this.renderMenuGrid();
            this.renderCategoryChips();
            alert("Base de datos de menús vaciada por completo. Ahora está en 0 para cargar desde cero.");
        }
    }

    async toggleItemAvailability(itemId, isAvailable) {
        const ok = await this.updateMenuRemote(menu => {
            const item = menu.find(i => i.id === itemId);
            if (item) {
                item.available = isAvailable;
                // Si el item cambia disponibilidad, se actualizan las etiquetas para un stock limpio
                if (!isAvailable) {
                    item.tag = "Sin Stock";
                } else if (item.tag === "Sin Stock") {
                    item.tag = "";
                }
            }
            return menu;
        });
        if (!ok) alert("No se pudo guardar el cambio. Revisá tu conexión e intentá de nuevo.");
        this.renderMenuGrid();
        this.renderMenuEditor();
    }

    async deleteMenuItem(itemId) {
        if (confirm("¿Estás seguro de que quieres eliminar esta vianda del menú? Esta acción no se puede deshacer.")) {
            const ok = await this.updateMenuRemote(menu => menu.filter(i => i.id !== itemId));
            if (!ok) alert("No se pudo eliminar. Revisá tu conexión e intentá de nuevo.");
            this.renderCategoryChips();
            this.renderMenuGrid();
            this.renderMenuEditor();
        }
    }

    openMenuModal(itemId = null) {
        const modal = document.getElementById("menu-modal");
        const title = document.getElementById("modal-title-text");
        const form = document.getElementById("menu-form");

        // Reset form
        form.reset();
        document.getElementById("menu-id-field").value = "";

        if (itemId) {
            // Modo Edición
            const item = this.menu.find(i => i.id === itemId);
            if (item) {
                title.innerText = "Editar Vianda";
                document.getElementById("menu-id-field").value = item.id;
                document.getElementById("menu-name").value = item.name;
                document.getElementById("menu-description").value = item.description;
                const catSelect = document.getElementById("menu-category");
                if (item.category) {
                    if (![...catSelect.options].some(o => o.value.toLowerCase() === item.category.toLowerCase())) {
                        const opt = document.createElement("option");
                        opt.value = item.category;
                        opt.textContent = item.category;
                        catSelect.appendChild(opt);
                    }
                    catSelect.value = item.category;
                }
                document.getElementById("menu-type-select").value = item.type || "particular";
                document.getElementById("menu-price").value = item.price;

                // Seleccionar Menú 1 al 30 de forma normalizada
                const tagSelect = document.getElementById("menu-tag");
                const currentTag = item.tag || "";
                tagSelect.value = currentTag;
                if (!tagSelect.value && currentTag) {
                    const match = currentTag.match(/\d+/);
                    if (match) {
                        tagSelect.value = `Menú ${match[0]}`;
                    }
                }

                document.getElementById("menu-image").value = item.image || "";
                document.getElementById("menu-stock").value = item.stock ?? "";
                document.getElementById("menu-available").checked = item.available;

                document.getElementById("menu-kcal").value = item.macros?.kcal || "";
                document.getElementById("menu-protein").value = item.macros?.protein || "";
                document.getElementById("menu-carbs").value = item.macros?.carbs || "";
                document.getElementById("menu-fat").value = item.macros?.fat || "";
            }
        } else {
            // Modo Creación
            title.innerText = "Agregar Nueva Vianda";
            document.getElementById("menu-type-select").value = "particular";
            document.getElementById("menu-tag").value = "";
            document.getElementById("menu-available").checked = true;
            document.getElementById("menu-stock").value = "";

            document.getElementById("menu-kcal").value = "";
            document.getElementById("menu-protein").value = "";
            document.getElementById("menu-carbs").value = "";
            document.getElementById("menu-fat").value = "";
        }

        modal.style.display = "flex";
    }

    closeMenuModal() {
        const modal = document.getElementById("menu-modal");
        if (modal) {
            modal.style.display = "none";
        }
    }

    async handleMenuSubmit(event) {
        event.preventDefault();

        const id = document.getElementById("menu-id-field").value;
        const name = document.getElementById("menu-name").value.trim();
        const description = document.getElementById("menu-description").value.trim();
        const category = document.getElementById("menu-category").value;
        const type = document.getElementById("menu-type-select").value;
        const price = parseFloat(document.getElementById("menu-price").value);
        const tag = document.getElementById("menu-tag").value.trim();
        const image = document.getElementById("menu-image").value.trim();
        const available = document.getElementById("menu-available").checked;

        const stockStr = document.getElementById("menu-stock").value.trim();
        const stock = stockStr === "" ? null : parseInt(stockStr, 10);

        if (!name) {
            alert("Escribí el nombre de la vianda.");
            return;
        }
        if (!Number.isFinite(price) || price < 0) {
            alert("Ingresá un precio válido (número mayor o igual a 0).");
            return;
        }
        if (stock !== null && (!Number.isFinite(stock) || stock < 0)) {
            alert("El stock debe ser un número entero mayor o igual a 0, o dejarlo vacío.");
            return;
        }

        const kcal = document.getElementById("menu-kcal").value.trim();
        const protein = document.getElementById("menu-protein").value.trim();
        const carbs = document.getElementById("menu-carbs").value.trim();
        const fat = document.getElementById("menu-fat").value.trim();

        const macros = {};
        if (kcal) macros.kcal = kcal;
        if (protein) macros.protein = protein;
        if (carbs) macros.carbs = carbs;
        if (fat) macros.fat = fat;

        const newId = `m${Date.now()}`;
        const ok = await this.updateMenuRemote(menu => {
            if (id) {
                // Editar existente (sobre la última versión guardada en Firebase)
                const index = menu.findIndex(item => item.id === id);
                if (index > -1) {
                    menu[index] = { ...menu[index], name, description, category, price, type, tag, image, stock, available, macros };
                }
            } else {
                // Crear nuevo
                menu.push({ id: newId, name, description, category, price, type, tag, image, stock, available, macros });
            }
            return menu;
        });
        if (!ok) {
            alert("No se pudo guardar la vianda. Revisá tu conexión e intentá de nuevo.");
            return;
        }

        this.renderCategoryChips();
        this.renderMenuGrid();
        this.renderMenuEditor();
        this.closeMenuModal();
    }

    handleLogoError(imgElement) {
        const sources = ["logo1.svg", "logo.svg", "logo.png", "logo.jpg", "logo.jpeg", "logo.PNG", "logo.JPG", "logo.JPEG"];
        const currentSrcAttr = imgElement.getAttribute("src");
        const currentIndex = sources.indexOf(currentSrcAttr);

        if (currentIndex > -1 && currentIndex < sources.length - 1) {
            imgElement.src = sources[currentIndex + 1];
        } else {
            imgElement.style.display = 'none';
            const fallback = document.getElementById('brand-icon-fallback');
            if (fallback) fallback.style.display = 'inline';
        }
    }

    handleHeroLogoError(imgElement) {
        const sources = ["logo1.svg", "logo.png", "logo.svg"];
        const currentSrcAttr = imgElement.getAttribute("src");
        const currentIndex = sources.indexOf(currentSrcAttr);

        if (currentIndex > -1 && currentIndex < sources.length - 1) {
            imgElement.src = sources[currentIndex + 1];
        } else {
            imgElement.style.display = "none";
        }
    }

    // --- GESTIÓN DE EMPRESAS AUTORIZADAS (Admin) ---
    renderCorporateCompanyDropdown() {
        const dropdown = document.getElementById("checkout-company-select");
        if (!dropdown) return;

        if (this.companies.length === 0) {
            dropdown.innerHTML = `<option value="" disabled selected>No hay empresas autorizadas. Contacta al Admin.</option>`;
            return;
        }

        dropdown.innerHTML = `
            <option value="" disabled selected>Selecciona tu empresa...</option>
            ${this.companies.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)}</option>`).join("")}
        `;
    }

    renderCompaniesTable() {
        const tbody = document.getElementById("companies-table-body");
        if (!tbody) return;

        if (this.companies.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; padding: 2rem; color: var(--dark-muted);">No hay empresas autorizadas. Agrega una nueva.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.companies.map((company, index) => `
            <tr>
                <td style="font-weight: 600; font-size: 0.95rem; color: var(--dark); padding-left: 1.5rem;">${this.escapeHtml(company.name)}</td>
                <td style="font-family: monospace; font-size: 0.9rem; color: var(--gray-600);">${this.escapeHtml(company.password)}</td>
                <td style="text-align: center;">
                    <button class="btn-icon delete" onclick="app.deleteCompany(${index})" title="Eliminar Empresa" style="margin: 0 auto;">${APP_ICONS.delete}</button>
                </td>
            </tr>
        `).join("");
    }

    openCompanyModal() {
        const modal = document.getElementById("company-modal");
        if (modal) {
            document.getElementById("company-form").reset();
            modal.style.display = "flex";
        }
    }

    closeCompanyModal() {
        const modal = document.getElementById("company-modal");
        if (modal) modal.style.display = "none";
    }

    handleCompanySubmit(event) {
        event.preventDefault();
        const name = document.getElementById("company-name-input").value.trim();
        const password = document.getElementById("company-password-input").value.trim();

        if (name && password) {
            // Evitar duplicados (insensible a mayúsculas/minúsculas)
            if (this.companies.some(c => c.name.toLowerCase() === name.toLowerCase())) {
                alert("Esta empresa ya se encuentra autorizada.");
                return;
            }
            this.companies.push({ name, password });
            this.saveCompaniesToLocalStorage();
            this.renderCompaniesTable();
            this.closeCompanyModal();
            this.renderCorporateCompanyDropdown();
        }
    }

    deleteCompany(index) {
        const companyName = this.companies[index].name;
        if (confirm(`¿Estás seguro de que deseas eliminar permanentemente a la empresa "${companyName}"?\nLos empleados de esta empresa ya no podrán ingresar a realizar pedidos.`)) {
            this.companies.splice(index, 1);
            this.saveCompaniesToLocalStorage();
            this.renderCompaniesTable();
            this.renderCorporateCompanyDropdown();
        }
    }
}

// Crear instancia de la app global
const app = new NutriRootsApp();
window.app = app;
