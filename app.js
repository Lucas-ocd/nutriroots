// app.js - Lógica y gestión de estado de NutriRoots

class NutriRootsApp {
    constructor() {
        // Datos de configuración
        this.WHATSAPP_NUMBER = "5491155555555"; // Número de WhatsApp del negocio (formato internacional sin +)
        this.SHIPPING_COST = 500; // Costo fijo de envío
        
        // Estado de la aplicación
        this.menu = [];
        this.orders = [];
        this.cart = [];
        this.selectedCategory = "Todas";
        this.currentView = "client";
        this.currentAdminTab = "orders";
        this.currentOrderFilter = "all";
        this.menuLayout = "list"; // Vista de lista por defecto para los 10 menús semanales
        
        // Inicializar
        document.addEventListener("DOMContentLoaded", () => this.init());
    }

    init() {
        this.loadLocalStorageData();
        this.renderCategoryChips();
        this.renderMenuGrid();
        this.updateCartUI();
        
        // Verificar si se accede como administrador mediante parámetro en la URL (?admin)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("admin")) {
            const adminLink = document.getElementById("nav-admin-link");
            const heroAdminBtn = document.getElementById("hero-admin-btn");
            if (adminLink) adminLink.style.display = "inline-block";
            if (heroAdminBtn) heroAdminBtn.style.display = "inline-block";
            
            this.renderOrdersTable();
            this.renderMenuEditor();
            this.updateAdminStats();
        }
        
        // Establecer fecha mínima en el formulario (hoy)
        const dateInput = document.getElementById("checkout-date");
        if (dateInput) {
            const today = new Date().toISOString().split("T")[0];
            dateInput.min = today;
            dateInput.value = today;
        }
    }

    // --- MANEJO DE PERSISTENCIA ---
    loadLocalStorageData() {
        const localMenu = localStorage.getItem("nr_menu");
        const localOrders = localStorage.getItem("nr_orders");
        
        if (localMenu) {
            this.menu = JSON.parse(localMenu);
        } else {
            this.menu = [...INITIAL_MENU];
            localStorage.setItem("nr_menu", JSON.stringify(this.menu));
        }

        if (localOrders) {
            this.orders = JSON.parse(localOrders);
        } else {
            this.orders = [...INITIAL_ORDERS];
            localStorage.setItem("nr_orders", JSON.stringify(this.orders));
        }
    }

    saveMenuToLocalStorage() {
        localStorage.setItem("nr_menu", JSON.stringify(this.menu));
    }

    saveOrdersToLocalStorage() {
        localStorage.setItem("nr_orders", JSON.stringify(this.orders));
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
                this.updateAdminStats();
                this.renderOrdersTable();
                this.renderMenuEditor();
            } else {
                activeSection.style.display = "block";
                if (viewName === "client") {
                    document.getElementById("nav-client-link").classList.add("active");
                }
            }
        }
        
        // Cerrar carrito por si está abierto
        this.closeCart();
        
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
        const categories = new Set(this.menu.map(item => item.category));
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
        
        const filteredMenu = this.selectedCategory === "Todas" 
            ? this.menu 
            : this.menu.filter(item => item.category === this.selectedCategory);
            
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

                // Convertir acentos para la clase CSS
                const dayClass = item.tag ? item.tag.toLowerCase().replace("ércoles", "coles") : 'lunes';
                return `
                    <div class="menu-list-row" style="opacity: ${isAvailable ? 1 : 0.6}">
                        <div class="menu-list-day ${dayClass}">${item.tag || 'Menú'}</div>
                        <img class="menu-list-img" src="${imageUrl}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'">
                        <div class="menu-list-info">
                            <h3 class="menu-list-title">${item.name}</h3>
                            <p class="menu-list-desc">${item.description}</p>
                        </div>
                        <div class="menu-list-price">$${item.price.toLocaleString("es-AR")} <span>c/u</span></div>
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

                return `
                    <div class="menu-card" style="opacity: ${isAvailable ? 1 : 0.7}">
                        ${hasTag ? `<div class="menu-card-badge ${!isAvailable ? 'out-of-stock' : ''}">${item.tag}</div>` : ''}
                        ${!isAvailable && !hasTag ? `<div class="menu-card-badge out-of-stock">Agotado</div>` : ''}
                        <div class="menu-card-image-wrapper">
                            <img class="menu-card-image" src="${imageUrl}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'">
                        </div>
                        <div class="menu-card-content">
                            <h3 class="menu-card-title">${item.name}</h3>
                            <p class="menu-card-desc">${item.description}</p>
                            <div class="menu-card-footer">
                                <div class="menu-card-price">$${item.price.toLocaleString("es-AR")} <span>c/u</span></div>
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
        
        // Feedback visual rápido
        this.openCartBriefly();
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
        
        if (countBadge) {
            countBadge.innerText = totalItems;
        }
        
        // Actualizar botón de checkout del carrito
        const btnCheckout = document.getElementById("btn-cart-checkout");
        if (btnCheckout) {
            btnCheckout.disabled = totalItems === 0;
        }
    }

    renderCartItems() {
        const container = document.getElementById("cart-items");
        const subtotalSpan = document.getElementById("cart-subtotal");
        const totalSpan = document.getElementById("cart-total");
        
        if (!container) return;

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
            return;
        }

        container.innerHTML = this.cart.map(item => {
            const imageUrl = item.image && item.image.trim() !== "" 
                ? item.image 
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
            return `
                <div class="cart-item">
                    <img class="cart-item-img" src="${imageUrl}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toLocaleString("es-AR")}</div>
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
        const grandTotal = subtotal + this.SHIPPING_COST;

        subtotalSpan.innerText = `$${subtotal.toLocaleString("es-AR")}`;
        totalSpan.innerText = `$${grandTotal.toLocaleString("es-AR")}`;
    }

    // --- PROCESAR COMPRA (CHECKOUT) ---
    proceedToCheckout() {
        if (this.cart.length === 0) return;
        this.closeCart();
        this.showView("checkout");
        this.renderCheckoutSummary();
    }

    renderCheckoutSummary() {
        const container = document.getElementById("checkout-summary-items");
        const subtotalSpan = document.getElementById("checkout-subtotal");
        const shippingSpan = document.getElementById("checkout-shipping");
        const totalSpan = document.getElementById("checkout-total");
        
        if (!container) return;

        container.innerHTML = this.cart.map(item => `
            <div class="summary-item">
                <span class="summary-item-name">${item.name} <span class="summary-item-qty">x${item.quantity}</span></span>
                <span>$${(item.price * item.quantity).toLocaleString("es-AR")}</span>
            </div>
        `).join("");

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const grandTotal = subtotal + this.SHIPPING_COST;

        subtotalSpan.innerText = `$${subtotal.toLocaleString("es-AR")}`;
        shippingSpan.innerText = `$${this.SHIPPING_COST.toLocaleString("es-AR")}`;
        totalSpan.innerText = `$${grandTotal.toLocaleString("es-AR")}`;
    }

    handleCheckoutSubmit(event) {
        event.preventDefault();
        
        if (this.cart.length === 0) {
            alert("Tu carrito está vacío. Vuelve a seleccionar platos.");
            this.showView("client");
            return;
        }

        const name = document.getElementById("checkout-name").value.trim();
        const phone = document.getElementById("checkout-phone").value.trim();
        const address = document.getElementById("checkout-address").value.trim();
        const deliveryDate = document.getElementById("checkout-date").value;
        const deliveryTime = document.getElementById("checkout-time").value;
        const paymentMethod = document.getElementById("checkout-payment").value;
        const notes = document.getElementById("checkout-notes").value.trim();

        // Generar un ID incremental o aleatorio único
        const orderNumber = 1000 + this.orders.length + 1;
        const orderId = `NR-${orderNumber}`;

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + this.SHIPPING_COST;

        const newOrder = {
            id: orderId,
            customerName: name,
            phone: phone,
            address: address,
            deliveryDate: deliveryDate,
            deliveryTime: deliveryTime,
            paymentMethod: paymentMethod,
            items: this.cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            subtotal: subtotal,
            shipping: this.SHIPPING_COST,
            total: total,
            status: "pendiente",
            notes: notes,
            createdAt: new Date().toISOString()
        };

        // Guardar pedido en base de datos
        this.orders.push(newOrder);
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
        message += `*Teléfono:* ${order.phone}\n`;
        message += `*Dirección:* ${order.address}\n`;
        message += `*Entrega:* ${order.deliveryDate} - ${order.deliveryTime}\n`;
        message += `*Método de Pago:* ${order.paymentMethod}\n`;
        if (order.notes) {
            message += `*Notas:* _${order.notes}_\n`;
        }
        message += `\n*--- DETALLE DEL PEDIDO ---*\n`;
        
        order.items.forEach(item => {
            message += `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-AR")})\n`;
        });
        
        message += `\n*Envío:* $${order.shipping.toLocaleString("es-AR")}\n`;
        message += `*TOTAL A PAGAR: $${order.total.toLocaleString("es-AR")}*\n\n`;
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
        
        // Ocultar tabs
        document.getElementById("admin-tab-orders").style.display = "none";
        document.getElementById("admin-tab-menu").style.display = "none";
        
        // Mostrar tab activo y destacar en sidebar
        if (tabName === "orders") {
            document.getElementById("side-orders-btn").classList.add("active");
            document.getElementById("admin-tab-orders").style.display = "block";
            this.renderOrdersTable();
        } else if (tabName === "menu") {
            document.getElementById("side-menu-btn").classList.add("active");
            document.getElementById("admin-tab-menu").style.display = "block";
            this.renderMenuEditor();
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
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--dark-muted);">No se encontraron pedidos.</td></tr>`;
            return;
        }

        tbody.innerHTML = filteredOrders.map(order => {
            const itemsSummary = order.items.map(item => `${item.quantity}x ${item.name.substring(0,20)}...`).join("<br>");
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
                        <div style="font-weight: 600;">${order.customerName}</div>
                        <div style="font-size: 0.8rem; color: var(--dark-muted);">${order.phone}</div>
                    </td>
                    <td style="font-size: 0.85rem; line-height: 1.3;">${itemsSummary}</td>
                    <td>
                        <div style="font-weight: 500;">${order.deliveryDate}</div>
                        <div style="font-size: 0.8rem; color: var(--dark-muted);">${order.deliveryTime}</div>
                        <div style="font-size: 0.75rem; color: var(--dark-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px;" title="${order.address}">${order.address}</div>
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

    changeOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
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
        document.getElementById("order-phone").value = order.phone;
        document.getElementById("order-address").value = order.address;
        document.getElementById("order-deliveryDate").value = order.deliveryDate;
        document.getElementById("order-deliveryTime").value = order.deliveryTime;
        document.getElementById("order-paymentMethod").value = order.paymentMethod;
        document.getElementById("order-status").value = order.status;
        document.getElementById("order-notes").value = order.notes || "";
        
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
        const phone = document.getElementById("order-phone").value.trim();
        const address = document.getElementById("order-address").value.trim();
        const deliveryDate = document.getElementById("order-deliveryDate").value;
        const deliveryTime = document.getElementById("order-deliveryTime").value;
        const paymentMethod = document.getElementById("order-paymentMethod").value;
        const status = document.getElementById("order-status").value;
        const notes = document.getElementById("order-notes").value.trim();

        const order = this.orders.find(o => o.id === id);
        if (order) {
            order.customerName = name;
            order.phone = phone;
            order.address = address;
            order.deliveryDate = deliveryDate;
            order.deliveryTime = deliveryTime;
            order.paymentMethod = paymentMethod;
            order.status = status;
            order.notes = notes;
            
            this.saveOrdersToLocalStorage();
            this.updateAdminStats();
            this.renderOrdersTable();
            this.closeOrderModal();
        }
    }

    deleteOrder(orderId) {
        if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el pedido ${orderId}?`)) {
            this.orders = this.orders.filter(o => o.id !== orderId);
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
                document.getElementById("menu-price").value = item.price;
                document.getElementById("menu-tag").value = item.tag || "";
                document.getElementById("menu-image").value = item.image || "";
                document.getElementById("menu-available").checked = item.available;
            }
        } else {
            // Modo Creación
            title.innerText = "Agregar Nueva Vianda";
            document.getElementById("menu-available").checked = true;
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
        const price = parseFloat(document.getElementById("menu-price").value);
        const tag = document.getElementById("menu-tag").value.trim();
        const image = document.getElementById("menu-image").value.trim();
        const available = document.getElementById("menu-available").checked;

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
                    tag,
                    image,
                    available
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
                tag,
                image,
                available
            });
        }

        this.saveMenuToLocalStorage();
        this.renderCategoryChips();
        this.renderMenuGrid();
        this.renderMenuEditor();
        this.closeMenuModal();
    }
}

// Crear instancia de la app global
const app = new NutriRootsApp();
window.app = app;
