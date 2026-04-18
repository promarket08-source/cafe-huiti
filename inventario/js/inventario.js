let productos = [];
let categorias = [];
let deleteCallback = null;

const defaultCategorias = [
    { id: 'granos', nombre: 'Café en Grano', icono: '☕' },
    { id: 'molido', nombre: 'Café Molido', icono: '🫘' },
    { id: 'capsulas', nombre: 'Cápsulas', icono: '💊' },
    { id: 'insumos', nombre: 'Insumos', icono: '🍫' },
    { id: 'lacteos', nombre: 'Lácteos', icono: '🥛' },
    { id: 'reposteria', nombre: 'Repostería', icono: '🧁' },
    { id: 'bebidas', nombre: 'Bebidas', icono: '🥤' },
    { id: 'empaque', nombre: 'Empaque', icono: '📦' }
];

const defaultProductos = [
    { id: 1, nombre: 'Café Grano Premium Ethiopia', categoria: 'granos', stock: 25, minimo: 10, unidad: 'kg', precio: 18000, marca: 'Origen' },
    { id: 2, nombre: 'Café Grano Colombia Supremo', categoria: 'granos', stock: 30, minimo: 15, unidad: 'kg', precio: 15000, marca: 'Importado' },
    { id: 3, nombre: 'Café Grano Brasil Santos', categoria: 'granos', stock: 20, minimo: 10, unidad: 'kg', precio: 12000, marca: 'Importado' },
    { id: 4, nombre: 'Café Molido Filtro', categoria: 'molido', stock: 15, minimo: 10, unidad: 'kg', precio: 14000, marca: 'Propio' },
    { id: 5, nombre: 'Café Molido Espresso', categoria: 'molido', stock: 12, minimo: 8, unidad: 'kg', precio: 16000, marca: 'Propio' },
    { id: 6, nombre: 'Cápsulas Compatibles Nespresso', categoria: 'capsulas', stock: 50, minimo: 30, unidad: 'unidades', precio: 800, marca: 'Genérico' },
    { id: 7, nombre: 'Cápsulas Dolce Gusto', categoria: 'capsulas', stock: 40, minimo: 25, unidad: 'unidades', precio: 900, marca: 'Genérico' },
    { id: 8, nombre: 'Leche Entera', categoria: 'lacteos', stock: 20, minimo: 10, unidad: 'litros', precio: 1200, marca: 'Soprole' },
    { id: 9, nombre: 'Leche Descremada', categoria: 'lacteos', stock: 15, minimo: 8, unidad: 'litros', precio: 1100, marca: 'Soprole' },
    { id: 10, nombre: 'Crema de Leche', categoria: 'lacteos', stock: 8, minimo: 10, unidad: 'litros', precio: 2500, marca: 'Soprole' },
    { id: 11, nombre: 'Chocolate Institucional', categoria: 'insumos', stock: 5, minimo: 5, unidad: 'kg', precio: 8000, marca: 'Callebout' },
    { id: 12, nombre: 'Canela en Polvo', categoria: 'insumos', stock: 2, minimo: 2, unidad: 'kg', precio: 5000, marca: 'McCormick' },
    { id: 13, nombre: 'Vainilla Essence', categoria: 'insumos', stock: 3, minimo: 2, unidad: 'litros', precio: 6000, marca: 'Dr. Oetker' },
    { id: 14, nombre: 'Croissants Congelados', categoria: 'reposteria', stock: 50, minimo: 30, unidad: 'unidades', precio: 800, marca: 'Bakery' },
    { id: 15, nombre: 'Muffins Congelados', categoria: 'reposteria', stock: 40, minimo: 20, unidad: 'unidades', precio: 600, marca: 'Bakery' },
    { id: 16, nombre: 'Gomas Xantana', categoria: 'insumos', stock: 1, minimo: 2, unidad: 'kg', precio: 15000, marca: 'Importado' },
    { id: 17, nombre: 'Vasos Cartón 8oz', categoria: 'empaque', stock: 500, minimo: 200, unidad: 'unidades', precio: 50, marca: 'Generic' },
    { id: 18, nombre: 'Tapas Vasos 8oz', categoria: 'empaque', stock: 300, minimo: 150, unidad: 'unidades', precio: 30, marca: 'Generic' },
    { id: 19, nombre: 'Bolsas Café 250g', categoria: 'empaque', stock: 100, minimo: 50, unidad: 'unidades', precio: 200, marca: 'Propio' },
    { id: 20, nombre: 'Sirope Vainilla', categoria: 'insumos', stock: 4, minimo: 5, unidad: 'litros', precio: 7000, marca: 'Monin' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupNavigation();
    updateDashboard();
});

function loadData() {
    const savedCategorias = localStorage.getItem('cafe_categorias');
    const savedProductos = localStorage.getItem('cafe_productos');
    
    if (savedCategorias) {
        categorias = JSON.parse(savedCategorias);
    } else {
        categorias = [...defaultCategorias];
        saveCategorias();
    }
    
    if (savedProductos) {
        productos = JSON.parse(savedProductos);
    } else {
        productos = [...defaultProductos];
        saveProductos();
    }
}

function saveCategorias() { localStorage.setItem('cafe_categorias', JSON.stringify(categorias)); }
function saveProductos() { localStorage.setItem('cafe_productos', JSON.stringify(productos)); }

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(item.dataset.view);
        });
    });
}

function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(`view-${viewName}`).classList.add('active');
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    const titles = { dashboard: 'Dashboard', inventario: 'Inventario', categorias: 'Categorías', alertas: 'Alertas' };
    document.getElementById('pageTitle').textContent = titles[viewName] || 'Dashboard';
    
    if (viewName === 'inventario') renderProductsTable();
    if (viewName === 'categorias') renderCategories();
    if (viewName === 'alertas') renderFullAlerts();
}

function updateDashboard() {
    const totalProductos = productos.length;
    const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
    const stockBajo = productos.filter(p => p.stock > 0 && p.stock < p.minimo).length;
    const sinStock = productos.filter(p => p.stock === 0).length;
    
    document.getElementById('totalProductos').textContent = totalProductos;
    document.getElementById('totalStock').textContent = totalStock;
    document.getElementById('stockBajo').textContent = stockBajo;
    document.getElementById('sinStock').textContent = sinStock;
    document.getElementById('alertsBadge').textContent = stockBajo + sinStock;
    
    renderRecentProducts();
    renderAlertsList();
    updateCategorySelects();
}

function renderRecentProducts() {
    const container = document.getElementById('recentProducts');
    const recent = productos.slice(-5).reverse();
    
    if (recent.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay productos registrados</p>';
        return;
    }
    
    container.innerHTML = recent.map(p => {
        const cat = categorias.find(c => c.id === p.categoria) || { icono: '📦', nombre: 'Sin categoría' };
        return `
            <div class="recent-item">
                <div class="recent-icon">${cat.icono}</div>
                <div class="recent-info">
                    <div class="recent-name">${p.nombre}</div>
                    <div class="recent-category">${cat.nombre} | ${p.unidad}</div>
                </div>
                <div class="recent-stock">
                    <div class="recent-stock-value">${p.stock}</div>
                    <div class="recent-stock-label">${p.unidad}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderAlertsList() {
    const container = document.getElementById('alertsList');
    const alerts = productos.filter(p => p.stock < p.minimo);
    
    if (alerts.length === 0) {
        container.innerHTML = '<p class="empty-state">✓ Todo en orden</p>';
        return;
    }
    
    container.innerHTML = alerts.slice(0, 5).map(p => {
        const status = getStockStatus(p);
        const diff = p.minimo - p.stock;
        return `
            <div class="alert-item">
                <span class="alert-icon">${status === 'danger' ? '🔴' : '⚠️'}</span>
                <div class="alert-info">
                    <div class="alert-name">${p.nombre}</div>
                    <div class="alert-detail">Necesitas ${diff} ${p.unidad} más</div>
                </div>
                <span class="alert-stock ${status}">${p.stock} / ${p.minimo}</span>
            </div>
        `;
    }).join('');
}

function renderFullAlerts() {
    const container = document.getElementById('fullAlertsList');
    const alerts = productos.filter(p => p.stock < p.minimo);
    
    if (alerts.length === 0) {
        container.innerHTML = '<p class="empty-state" style="padding: 60px;">✓ Todo en orden. No hay alertas de stock.</p>';
        return;
    }
    
    container.innerHTML = alerts.map(p => {
        const status = getStockStatus(p);
        const diff = p.minimo - p.stock;
        const cat = categorias.find(c => c.id === p.categoria) || { icono: '📦', nombre: 'Sin categoría' };
        return `
            <div class="full-alert-item ${status}">
                <span style="font-size: 2rem;">${cat.icono}</span>
                <div class="full-alert-content">
                    <div class="full-alert-title">${p.nombre}</div>
                    <div class="full-alert-meta">${cat.nombre} • Faltan ${diff} ${p.unidad}</div>
                </div>
                <span class="alert-stock ${status}">${p.stock} / ${p.minimo}</span>
            </div>
        `;
    }).join('');
}

function getStockStatus(producto) {
    if (producto.stock === 0) return 'danger';
    if (producto.stock < producto.minimo) return 'warning';
    return 'good';
}

function getStockBarClass(producto) {
    const ratio = producto.stock / producto.minimo;
    if (ratio >= 1) return 'good';
    if (ratio >= 0.5) return 'warning';
    return 'danger';
}

function renderProductsTable(filtered = null) {
    const data = filtered || productos;
    const tbody = document.getElementById('productsTable');
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No hay productos</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(p => {
        const cat = categorias.find(c => c.id === p.categoria) || { icono: '📦', nombre: 'Sin categoría' };
        const status = getStockStatus(p);
        const barClass = getStockBarClass(p);
        const barWidth = Math.min((p.stock / p.minimo) * 100, 100);
        
        return `
            <tr>
                <td>
                    <div class="product-name">${p.nombre}</div>
                    ${p.marca ? `<div style="font-size: 0.85rem; color: var(--muted);">${p.marca}</div>` : ''}
                </td>
                <td>${cat.icono} ${cat.nombre}</td>
                <td>
                    <div class="stock-cell">
                        <span class="stock-status ${status}">${p.stock}</span>
                        <div class="stock-bar">
                            <div class="stock-bar-fill ${barClass}" style="width: ${barWidth}%"></div>
                        </div>
                    </div>
                </td>
                <td>${p.minimo} ${p.unidad}</td>
                <td>$${p.precio ? p.precio.toLocaleString('es-CL') : '-'}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="editProduct(${p.id})" title="Editar">✏️</button>
                        <button class="action-btn delete" onclick="confirmDelete(${p.id})" title="Eliminar">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    
    container.innerHTML = categorias.map(cat => {
        const count = productos.filter(p => p.categoria === cat.id).length;
        return `
            <div class="category-card">
                <div class="category-icon">${cat.icono}</div>
                <div class="category-info">
                    <div class="category-name">${cat.nombre}</div>
                    <div class="category-count">${count} productos</div>
                </div>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editCategoria('${cat.id}')" title="Editar">✏️</button>
                    <button class="action-btn delete" onclick="confirmDeleteCategoria('${cat.id}')" title="Eliminar">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateCategorySelects() {
    const selects = ['filterCategoria', 'productoCategoria'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const current = select.value;
            select.innerHTML = `<option value="">Todas las categorías</option>` + 
                categorias.map(c => `<option value="${c.id}">${c.icono} ${c.nombre}</option>`).join('');
            select.value = current;
        }
    });
}

function filterProducts() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const categoria = document.getElementById('filterCategoria').value;
    const stockFilter = document.getElementById('filterStock').value;
    
    let filtered = productos.filter(p => {
        const matchSearch = p.nombre.toLowerCase().includes(search) || p.marca?.toLowerCase().includes(search);
        const matchCategoria = !categoria || p.categoria === categoria;
        const status = getStockStatus(p);
        const matchStock = !stockFilter || 
            (stockFilter === 'bajo' && status === 'warning') ||
            (stockFilter === 'sin' && status === 'danger') ||
            (stockFilter === 'normal' && status === 'good');
        return matchSearch && matchCategoria && matchStock;
    });
    
    renderProductsTable(filtered);
}

function openModal(type) {
    document.getElementById(`modal${type.charAt(0).toUpperCase() + type.slice(1)}`).classList.add('active');
    if (type === 'producto') {
        document.getElementById('productoForm').reset();
        document.getElementById('productoId').value = '';
        document.getElementById('modalProductoTitle').textContent = 'Agregar Producto';
    }
}

function closeModal(type) {
    document.getElementById(`modal${type.charAt(0).toUpperCase() + type.slice(1)}`).classList.remove('active');
}

function saveProduct(e) {
    e.preventDefault();
    
    const id = document.getElementById('productoId').value;
    const productoData = {
        nombre: document.getElementById('productoNombre').value,
        categoria: document.getElementById('productoCategoria').value,
        stock: parseInt(document.getElementById('productoStock').value),
        minimo: parseInt(document.getElementById('productoMinimo').value),
        unidad: document.getElementById('productoUnidad').value,
        precio: parseInt(document.getElementById('productoPrecio').value) || 0,
        marca: document.getElementById('productoMarca').value
    };
    
    if (id) {
        const index = productos.findIndex(p => p.id === parseInt(id));
        if (index !== -1) productos[index] = { ...productos[index], ...productoData };
    } else {
        productoData.id = Date.now();
        productos.push(productoData);
    }
    
    saveProductos();
    closeModal('producto');
    updateDashboard();
    renderProductsTable();
}

function editProduct(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    document.getElementById('productoId').value = producto.id;
    document.getElementById('productoNombre').value = producto.nombre;
    document.getElementById('productoCategoria').value = producto.categoria;
    document.getElementById('productoStock').value = producto.stock;
    document.getElementById('productoMinimo').value = producto.minimo;
    document.getElementById('productoUnidad').value = producto.unidad;
    document.getElementById('productoPrecio').value = producto.precio || '';
    document.getElementById('productoMarca').value = producto.marca || '';
    
    document.getElementById('modalProductoTitle').textContent = 'Editar Producto';
    openModal('producto');
}

function confirmDelete(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    document.getElementById('confirmarTexto').textContent = `¿Eliminar "${producto.nombre}" del inventario?`;
    deleteCallback = () => {
        productos = productos.filter(p => p.id !== id);
        saveProductos();
        updateDashboard();
        renderProductsTable();
    };
    openModal('confirmar');
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
    if (deleteCallback) { deleteCallback(); deleteCallback = null; }
    closeModal('confirmar');
});

function saveCategoria(e) {
    e.preventDefault();
    
    const id = document.getElementById('categoriaId').value;
    const catData = {
        nombre: document.getElementById('categoriaNombre').value,
        icono: document.getElementById('categoriaIcono').value
    };
    
    if (id) {
        const index = categorias.findIndex(c => c.id === id);
        if (index !== -1) categorias[index] = { ...categorias[index], ...catData };
    } else {
        catData.id = catData.nombre.toLowerCase().replace(/\s+/g, '_');
        categorias.push(catData);
    }
    
    saveCategorias();
    closeModal('categoria');
    updateDashboard();
    renderCategories();
}

function editCategoria(id) {
    const cat = categorias.find(c => c.id === id);
    if (!cat) return;
    
    document.getElementById('categoriaId').value = cat.id;
    document.getElementById('categoriaNombre').value = cat.nombre;
    document.getElementById('categoriaIcono').value = cat.icono;
    openModal('categoria');
}

function confirmDeleteCategoria(id) {
    const cat = categorias.find(c => c.id === id);
    if (!cat) return;
    
    const productoCount = productos.filter(p => p.categoria === id).length;
    let mensaje = `¿Eliminar la categoría "${cat.nombre}"?`;
    if (productoCount > 0) mensaje += ` (Hay ${productoCount} productos asociados)`;
    
    document.getElementById('confirmarTexto').textContent = mensaje;
    deleteCallback = () => {
        productos = productos.filter(p => p.categoria !== id);
        categorias = categorias.filter(c => c.id !== id);
        saveProductos();
        saveCategorias();
        updateDashboard();
        renderCategories();
    };
    openModal('confirmar');
}
