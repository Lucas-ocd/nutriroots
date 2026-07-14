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

class NutriRootsApp {
    constructor() {
        // Datos de configuración
        this.WHATSAPP_NUMBER = "5491155555555"; // Número de WhatsApp del negocio (formato internacional sin +)
        this.SHIPPING_COST = 4500; // Costo fijo de envío
        
        // Estado de la aplicación
        this.menu = [];
        this.orders = [];
        this.cart = [];
        this.selectedCategory = "Todas";
        this.currentView = "landing"; // Vista de selección de cocina por defecto
        this.currentAdminTab = "orders";
        this.currentOrderFilter = "all";
        this.menuLayout = "list"; // Vista de lista por defecto para los 10 menús semanales
        this.activeCompany = null; // Empresa activa ('nutriroots' o 'corporativo')
        this.adminSession = null; // Sesión de administrador activa ('nutriroots' o 'corporativo')
        this.clientCompany = null; // Empresa cliente activa (solo en catálogo corporativo)
        this.companies = []; // Lista de empresas clientes autorizadas (solo corporativo)
        this.catalogType = "particular"; // Catálogo de viandas activo ('particular' o 'corporativo')
        
        // Inicializar
        document.addEventListener("DOMContentLoaded", () => this.init());
    }

    async init() {
        this.activeCompany = "nutriroots";
        await this.loadData();

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
    }

    // --- MANEJO DE PERSISTENCIA ---
    async loadData() {
        try {
            const menuDoc = await db.collection("nutriroots_data").doc("menu").get();
            const ordersDoc = await db.collection("nutriroots_data").doc("orders").get();
            const companiesDoc = await db.collection("nutriroots_data").doc("companies").get();

            if (menuDoc.exists) {
                this.menu = menuDoc.data().data;
                this.migrateMenuCategories();
            } else {
                const localMenu = localStorage.getItem("nr_menu_unified_v2");
                if (localMenu) {
                    this.menu = JSON.parse(localMenu);
                    this.migrateMenuCategories();
                } else {
                    const retail = INITIAL_MENU_RETAIL.map(item => ({ ...item, type: "particular" }));
                    const corp = INITIAL_MENU_CORP.map(item => ({ ...item, type: "corporativo" }));
                    this.menu = [...retail, ...corp];
                }
                this.saveMenuToLocalStorage();
            }

            // Nueva colección para documentos individuales
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
                // Fallback: si la colección está vacía, intentamos recuperar del doc viejo o localStorage
                if (ordersDoc.exists) {
                    this.orders = ordersDoc.data().data;
                } else {
                    const localOrders = localStorage.getItem("nr_orders_unified_v2");
                    if (localOrders) {
                        this.orders = JSON.parse(localOrders);
                    } else {
                        const retailOrders = INITIAL_ORDERS_RETAIL.map(order => ({ ...order, type: "particular" }));
                        const corpOrders = INITIAL_ORDERS_CORP.map(order => ({ ...order, type: "corporativo" }));
                        this.orders = [...retailOrders, ...corpOrders];
                    }
                }
                
                // MIGRACIÓN AUTOMÁTICA: Guardamos cada orden en su propio documento
                this.orders.forEach(order => {
                    if(order.id) {
                        db.collection("orders").doc(order.id).set(order).catch(console.error);
                    }
                });
                
                // Ordenar por ID descendente
                this.orders.sort((a, b) => {
                    const idA = a.id || "";
                    const idB = b.id || "";
                    return idB.localeCompare(idA);
                });
            }

            if (companiesDoc.exists) {
                const parsed = companiesDoc.data().data;
                this.companies = parsed.map(c => typeof c === 'string' ? { name: c, password: 'corp123' } : c);
            } else {
                const localCompanies = localStorage.getItem("nr_companies_unified_v2");
                if (localCompanies) {
                    const parsed = JSON.parse(localCompanies);
                    this.companies = parsed.map(c => typeof c === 'string' ? { name: c, password: 'corp123' } : c);
                } else {
                    this.companies = [
                        { name: "TechCorp", password: "corp123" },
                        { name: "Estudio Contable", password: "corp123" },
                        { name: "Banco Galicia", password: "corp123" }
                    ];
                }
                this.saveCompaniesToLocalStorage();
            }
            
            console.log("Datos cargados correctamente desde Firebase.");
        } catch (error) {
            console.error("Error cargando Firebase, usando LocalStorage:", error);
            // Fallback
            const localMenu = localStorage.getItem("nr_menu_unified_v2");
            if (localMenu) {
                this.menu = JSON.parse(localMenu);
                this.migrateMenuCategories();
            }
            const localOrders = localStorage.getItem("nr_orders_unified_v2");
            if (localOrders) this.orders = JSON.parse(localOrders);
            const localCompanies = localStorage.getItem("nr_companies_unified_v2");
            if (localCompanies) {
                const parsed = JSON.parse(localCompanies);
                this.companies = parsed.map(c => typeof c === 'string' ? { name: c, password: 'corp123' } : c);
            }
        }
    }

    saveMenuToLocalStorage() {
        db.collection("nutriroots_data").doc("menu").set({ data: this.menu }).catch(console.error);
        localStorage.setItem("nr_menu_unified_v2", JSON.stringify(this.menu));
    }

    saveOrdersToLocalStorage() {
        // Ya NO guardamos el array gigante en Firebase para evitar race conditions.
        // Solo mantenemos un caché local por si falla internet.
        localStorage.setItem("nr_orders_unified_v2", JSON.stringify(this.orders));
    }

    saveCompaniesToLocalStorage() {
        db.collection("nutriroots_data").doc("companies").set({ data: this.companies }).catch(console.error);
        localStorage.setItem("nr_companies_unified_v2", JSON.stringify(this.companies));
    }

    migrateMenuCategories() {
        const defaults = [...INITIAL_MENU_RETAIL, ...INITIAL_MENU_CORP];
        const defaultMap = new Map(defaults.map(item => [item.id, item.category]));
        let changed = false;

        this.menu = this.menu.map(item => {
            if (!item.category || item.category.trim() === "") {
                changed = true;
                return { ...item, category: defaultMap.get(item.id) || "Clásicos" };
            }
            return item;
        });

        if (changed) {
            this.saveMenuToLocalStorage();
        }
    }

    getMenuDayClass(tag) {
        if (!tag) return "menu-1";
        const match = tag.match(/\d+/);
        return match ? `menu-${match[0]}` : "menu-1";
    }

    updateNavVisibility(viewName) {
        const cartToggle = document.getElementById("btn-cart-toggle");
        const navClientLink = document.getElementById("nav-client-link");
        const navAdminLink = document.getElementById("nav-admin-link");

        const catalogViews = ["client", "checkout"];
        const showCart = catalogViews.includes(viewName);

        if (cartToggle) {
            cartToggle.style.display = showCart ? "inline-flex" : "none";
        }
        if (navClientLink) {
            navClientLink.style.display = viewName === "landing" ? "none" : "";
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

    handleLoginSubmit(event) {
        event.preventDefault();
        const username = document.getElementById("login-username").value.trim().toLowerCase();
        const password = document.getElementById("login-password").value;
        const errorMsg = document.getElementById("login-error-msg");

        const credentials = {
            "admin": "roots123",
            "nutriroots": "roots123",
            "corporativo": "corp123"
        };

        if (credentials[username] && credentials[username] === password) {
            if (errorMsg) errorMsg.style.display = "none";
            this.adminSession = username;
            sessionStorage.setItem("nr_admin_session", username);
            this.selectCompany("nutriroots", false);
            this.showView("admin");
        } else {
            if (errorMsg) errorMsg.style.display = "block";
        }
    }

    handleLogout() {
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
        this.currentView = viewName;
        
        // Ocultar todas las secciones
        document.querySelectorAll(".view-section").forEach(section => {
            section.style.display = "none";
        });
        
        // Quitar active de nav links
        document.getElementById("nav-client-link").classList.remove("active");
        document.getElementById("nav-admin-link").classList.remove("active");
        
        // Mostrar vista activa
        const activeSection = document.getElementById(`view-${viewName}`);
        if (activeSection) {
            if (viewName === "admin") {
                activeSection.style.display = "grid"; // Admin usa grid
                document.getElementById("nav-admin-link").classList.add("active");
                
                const sideCompaniesBtn = document.getElementById("side-companies-btn");
                if (sideCompaniesBtn) {
                    sideCompaniesBtn.style.display = "block";
                }
                
                this.switchAdminTab(this.currentAdminTab);
                this.updateAdminStats();
                this.renderOrdersTable();
                this.renderMenuEditor();
            } else {
                activeSection.style.display = "block";
                if (viewName === "client") {
                    document.getElementById("nav-client-link").classList.add("active");
                }
                if (viewName === "corporate-login") {
                    const corpCompanySelect = document.getElementById("corporate-company-select");
                    if (corpCompanySelect) {
                        corpCompanySelect.innerHTML = '<option value="" disabled selected>Selecciona tu empresa...</option>' + 
                            this.companies.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
                    }
                }
                if (viewName === "checkout") {
                    const companySelect = document.getElementById("checkout-company-select");
                    if (companySelect) {
                        companySelect.innerHTML = '<option value="" disabled selected>Selecciona tu empresa...</option>' + 
                            this.companies.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
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
        const menuGrid = document.getElementById("menu-section");
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
                const isAvailable = item.available;
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
                        <button class="btn-list-add" onclick="app.addToCart('${item.id}')" ${!isAvailable ? 'disabled' : ''}>
                            ${isAvailable ? '+ Agregar' : 'Agotado'}
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
                const isAvailable = item.available;
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
                        ${!isAvailable && !hasTag ? `<div class="menu-card-badge out-of-stock">Agotado</div>` : ''}
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
        if (!menuItem || !menuItem.available) return;

        const cartItemIndex = this.cart.findIndex(item => item.id === itemId);

        if (cartItemIndex > -1) {
            this.cart[cartItemIndex].quantity += 1;
        } else {
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
        const totalQuantity = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        return totalQuantity >= 10 ? 0 : this.SHIPPING_COST;
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
                    <div class="cart-empty-icon">🛍️</div>
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
                promoDiv.innerHTML = "¡Envío GRATIS aplicado! 🎉";
                promoDiv.style.backgroundColor = "var(--green-success-light)";
                promoDiv.style.color = "var(--green-success)";
                promoDiv.style.border = "1px solid rgba(16, 185, 129, 0.2)";
            } else {
                const remaining = 10 - totalItems;
                promoDiv.innerHTML = `Llevas ${totalItems} viandas. ¡Agrega ${remaining} más para envío GRATIS! 🚚`;
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

    handleCheckoutSubmit(event) {
        event.preventDefault();
        
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
        if (isParticular && deliveryDate) {
            const dateObj = new Date(deliveryDate + 'T00:00:00');
            const dayOfWeek = dateObj.getDay(); // 0 = Domingo, 1 = Lunes
            if (dayOfWeek !== 0 && dayOfWeek !== 1) {
                alert("Las entregas solo se realizan los días Domingo o Lunes. Por favor, selecciona una fecha válida.");
                return;
            }
        }

        // Generar un ID incremental o aleatorio único
        const orderNumber = 1000 + this.orders.length + 1;
        const orderId = `NR-${orderNumber}`;

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = this.getShippingCost();
        const total = subtotal + shipping;

        const newOrder = {
            id: orderId,
            customerName: name,
            companyName: companyName,
            phone: phone,
            address: address,
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
        this.saveOrdersToLocalStorage();

        // Crear el mensaje para WhatsApp
        const waUrl = this.generateWhatsAppLink(newOrder);
        const waButton = document.getElementById("btn-whatsapp-send");
        if (waButton) {
            waButton.href = waUrl;
        }

        // Limpiar carrito
        this.cart = [];
        this.updateCartUI();
        document.getElementById("checkout-form").reset();

        // Mostrar pantalla de éxito
        this.showView("success");
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
        if (order.address) {
            message += `*Dirección:* ${order.address}\n`;
        }
        if (order.deliveryDate) {
            const dateFormatted = new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString("es-AR", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
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

    updateAdminStats() {
        const totalRevenueSpan = document.getElementById("stat-revenue");
        const totalOrdersSpan = document.getElementById("stat-orders-count");
        const pendingSpan = document.getElementById("stat-pending-count");
        
        if (!totalRevenueSpan) return;

        // Calcular ganancias solo de pedidos entregados o activos (no cancelados)
        const validOrders = this.orders.filter(order => order.status !== "cancelado");
        const totalRevenue = validOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrdersCount = this.orders.length;
        
        // Pedidos que requieren acción (pendiente o en cocina)
        const pendingCount = this.orders.filter(order => order.status === "pendiente" || order.status === "en_cocina").length;

        totalRevenueSpan.innerText = `$${totalRevenue.toLocaleString("es-AR")}`;
        totalOrdersSpan.innerText = totalOrdersCount;
        pendingSpan.innerText = pendingCount;
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
                            <span style="font-weight: 700; color: var(--primary); text-align: left;">${displayTag}: ${displayName}</span>
                            <span style="font-weight: 700; color: var(--dark); text-align: right; white-space: nowrap; font-size: 0.9rem;">x${item.quantity}</span>
                        </div>
                        ${itemDescription ? `<div style="font-size: 0.76rem; color: var(--gray-500); margin-top: 0.15rem; text-align: left; line-height: 1.25;">${itemDescription}</div>` : ""}
                    </div>
                `;
            }).join("");
            const dateFormatted = new Date(order.createdAt).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });

            return `
                <tr>
                    <td style="font-weight: 700; color: var(--primary);">${order.id}</td>
                    <td>
                        <div style="font-weight: 600; font-size: 0.95rem;">${order.customerName}</div>
                    </td>
                    <td>
                        ${order.companyName 
                            ? `<span style="font-size: 0.85rem; font-weight: 600; color: var(--primary); display: flex; align-items: center; gap: 0.2rem;">🏢 ${order.companyName}</span>` 
                            : `<span style="font-size: 0.8rem; color: var(--gray-500); font-style: italic;">👤 Cliente Particular</span>`}
                    </td>
                    <td style="font-size: 0.85rem; line-height: 1.3; vertical-align: top;">${itemsSummary}</td>
                    <td style="font-size: 0.85rem; line-height: 1.3; max-width: 200px; word-break: break-word;" title="${order.notes || ''}">
                        ${order.notes ? `_${order.notes}_` : '<span style="color: var(--gray-400);">Sin aclaraciones</span>'}
                    </td>
                    <td style="font-weight: 700;">$${order.total.toLocaleString("es-AR")}</td>
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
                            <button class="btn-icon edit" onclick="app.openOrderModal('${order.id}')" title="Editar Pedido">✏️</button>
                            <button class="btn-icon delete" onclick="app.deleteOrder('${order.id}')" title="Eliminar Pedido">🗑️</button>
                            ${order.phone ? `<button class="btn-icon whatsapp" onclick="app.sendWhatsAppConfirmation('${order.id}')" title="Enviar WhatsApp al Cliente" style="background: rgba(37, 211, 102, 0.1); color: #25d366; border-color: rgba(37, 211, 102, 0.2);">💬</button>` : ''}
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
        const headers = ["ID Pedido", "Fecha", "Cliente", "Empresa", "Pedido", "Notas del Pedido", "Subtotal", "Envío", "Total", "Estado"];
        
        // CSV Rows
        const rows = filteredOrders.map(order => {
            const dateFormatted = new Date(order.createdAt).toLocaleDateString("es-AR") + " " + new Date(order.createdAt).toLocaleTimeString("es-AR", {hour: '2-digit', minute:'2-digit'});
            const companyDisplay = order.companyName || "Cliente Particular";
            const itemsDisplay = order.items.map(item => {
                const menuItem = this.menu.find(m => m.id === item.id);
                const rawTag = item.tag || (menuItem ? menuItem.tag : "");
                const displayTag = rawTag ? rawTag.replace(/Opción/gi, "Menú") : "Menú";
                const displayName = item.name ? item.name.replace(/Menú Ejecutivo:\s*/gi, "") : "";
                return `${displayTag}: ${displayName} (x${item.quantity})`;
            }).join(" | ");

            const statusTranslate = this.translateStatus(order.status);
            
            return [
                order.id,
                dateFormatted,
                order.customerName,
                companyDisplay,
                itemsDisplay,
                order.notes || "",
                order.subtotal,
                order.shipping,
                order.total,
                statusTranslate
            ].map(val => {
                let cell = val === null || val === undefined ? '' : String(val);
                cell = cell.replace(/"/g, '""');
                if (cell.search(/("|,|\n)/g) >= 0) {
                    cell = `"${cell}"`;
                }
                return cell;
            });
        });

        // Generar archivo UTF-8 CSV con BOM
        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        const dateStr = new Date().toISOString().slice(0,10);
        link.setAttribute("href", url);
        link.setAttribute("download", `pedidos_${this.activeCompany}_${this.currentOrderFilter}_${dateStr}.csv`);
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
            const dateFormatted = new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString("es-AR", {weekday: 'long', day: 'numeric', month: 'long'});
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
        window.open(`https://api.whatsapp.com/send?phone=${order.phone}&text=${encodedText}`, '_blank');
    }

    changeOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            // Guardar individualmente en Firebase
            if (typeof db !== 'undefined') {
                db.collection("orders").doc(orderId).update({ status: newStatus }).catch(console.error);
            }
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
                const dateFormatted = order.deliveryDate ? new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString("es-AR", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : "";
                
                detailsContainer.innerHTML = `
                    <div style="font-weight: 700; color: var(--primary); margin-bottom: 0.4rem; border-bottom: 1px solid var(--primary-light); padding-bottom: 0.2rem;">📦 Detalles de Entrega y Pago</div>
                    <div style="margin-bottom: 0.15rem;"><strong>Teléfono:</strong> ${order.phone || 'N/A'}</div>
                    <div style="margin-bottom: 0.15rem;"><strong>Dirección:</strong> ${order.address || 'N/A'}</div>
                    <div style="margin-bottom: 0.15rem;"><strong>Fecha:</strong> ${dateFormatted || 'N/A'}</div>
                    <div style="margin-bottom: 0.15rem;"><strong>Horario:</strong> ${order.deliveryTime || 'N/A'}</div>
                    <div><strong>Método de Pago:</strong> ${order.paymentMethod || 'N/A'}</div>
                `;
            } else {
                detailsContainer.style.display = "none";
                detailsContainer.innerHTML = "";
            }
        }

        // Cargar y renderizar la lista de platos y totales en el modal
        const itemsList = document.getElementById("order-items-list");
        if (itemsList) {
            const itemsHtml = order.items.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; border-bottom: 1px dashed var(--gray-200); padding-bottom: 0.4rem;">
                    <span><strong>${item.quantity}x</strong> ${item.name}</span>
                    <span style="font-weight: 600;">$${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                </div>
            `).join("");
            
            const totalsHtml = `
                <div style="margin-top: 0.8rem; border-top: 1px solid var(--gray-300); padding-top: 0.6rem; font-size: 0.9rem;">
                    <div style="display: flex; justify-content: space-between; color: var(--gray-600); margin-bottom: 0.2rem;">
                        <span>Subtotal</span>
                        <span>$${order.subtotal.toLocaleString("es-AR")}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: var(--gray-600); margin-bottom: 0.2rem;">
                        <span>Envío</span>
                        <span>${order.shipping === 0 ? 'Gratis' : `$${order.shipping.toLocaleString("es-AR")}`}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--primary); font-size: 1rem; margin-top: 0.4rem;">
                        <span>Total</span>
                        <span>$${order.total.toLocaleString("es-AR")}</span>
                    </div>
                </div>
            `;
            itemsList.innerHTML = itemsHtml + totalsHtml;
        }
        
        modal.style.display = "flex";
    }

    closeOrderModal() {
        const modal = document.getElementById("order-modal");
        if (modal) modal.style.display = "none";
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
            
            // Guardar individualmente en Firebase
            if (typeof db !== 'undefined') {
                db.collection("orders").doc(id).set(order).catch(console.error);
            }
            
            this.saveOrdersToLocalStorage();
            this.updateAdminStats();
            this.renderOrdersTable();
            this.closeOrderModal();
        }
    }

    deleteOrder(orderId) {
        if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el pedido ${orderId}?`)) {
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
                        <button class="btn-icon edit" onclick="app.openMenuModal('${item.id}')" title="Editar">✏️</button>
                        <button class="btn-icon delete" onclick="app.deleteMenuItem('${item.id}')" title="Eliminar">🗑️</button>
                    </div>
                </div>
            `;
        }).join("");
    }

    toggleItemAvailability(itemId, isAvailable) {
        const item = this.menu.find(i => i.id === itemId);
        if (item) {
            item.available = isAvailable;
            // Si el item cambia disponibilidad, se actualizan las etiquetas para un stock limpio
            if (!isAvailable) {
                item.tag = "Sin Stock";
            } else if (item.tag === "Sin Stock") {
                item.tag = "";
            }
            this.saveMenuToLocalStorage();
            this.renderMenuGrid();
            this.renderMenuEditor();
        }
    }

    deleteMenuItem(itemId) {
        if (confirm("¿Estás seguro de que quieres eliminar esta vianda del menú? Esta acción no se puede deshacer.")) {
            this.menu = this.menu.filter(i => i.id !== itemId);
            this.saveMenuToLocalStorage();
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
                document.getElementById("menu-category").value = item.category;
                document.getElementById("menu-type-select").value = item.type || "particular";
                document.getElementById("menu-price").value = item.price;
                document.getElementById("menu-tag").value = item.tag || "";
                document.getElementById("menu-image").value = item.image || "";
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
            document.getElementById("menu-available").checked = true;
            
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

    handleMenuSubmit(event) {
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
        
        const kcal = document.getElementById("menu-kcal").value.trim();
        const protein = document.getElementById("menu-protein").value.trim();
        const carbs = document.getElementById("menu-carbs").value.trim();
        const fat = document.getElementById("menu-fat").value.trim();
        
        const macros = {};
        if (kcal) macros.kcal = kcal;
        if (protein) macros.protein = protein;
        if (carbs) macros.carbs = carbs;
        if (fat) macros.fat = fat;

        if (id) {
            // Editar existente
            const index = this.menu.findIndex(item => item.id === id);
            if (index > -1) {
                this.menu[index] = {
                    ...this.menu[index],
                    name,
                    description,
                    category,
                    price,
                    type,
                    tag,
                    image,
                    available,
                    macros
                };
            }
        } else {
            // Crear nuevo
            const newId = `m${Date.now()}`;
            this.menu.push({
                id: newId,
                name,
                description,
                category,
                price,
                type,
                tag,
                image,
                available,
                macros
            });
        }

        this.saveMenuToLocalStorage();
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
        const sources = ["logo1.svg", "logo.svg", "logo.png", "logo.jpg", "logo.jpeg", "logo.PNG", "logo.JPG", "logo.JPEG"];
        const currentSrcAttr = imgElement.getAttribute("src");
        const currentIndex = sources.indexOf(currentSrcAttr);
        
        if (currentIndex > -1 && currentIndex < sources.length - 1) {
            imgElement.src = sources[currentIndex + 1];
        } else {
            imgElement.src = "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80";
            imgElement.style.objectFit = "cover";
            imgElement.style.backgroundColor = "transparent";
            imgElement.style.padding = "0";
            imgElement.style.boxShadow = "var(--shadow-lg)";
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
            ${this.companies.map(c => `<option value="${c.name}">${c.name}</option>`).join("")}
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
                <td style="font-weight: 600; font-size: 0.95rem; color: var(--dark); padding-left: 1.5rem;">${company.name}</td>
                <td style="font-family: monospace; font-size: 0.9rem; color: var(--gray-600);">${company.password}</td>
                <td style="text-align: center;">
                    <button class="btn-icon delete" onclick="app.deleteCompany(${index})" title="Eliminar Empresa" style="padding: 0.4rem 0.6rem; background: none; border: none; cursor: pointer; font-size: 1.1rem;">🗑️</button>
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
                alert("⚠️ Esta empresa ya se encuentra autorizada.");
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
