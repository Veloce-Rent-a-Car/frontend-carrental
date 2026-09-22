// API Base - alterar se necessário
const API_BASE = 'http://localhost:8080';

// ============================================================
// Utils
// ============================================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

async function request(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorBody || res.statusText}`);
    }

    // Endpoints que retornam 204 ou empty
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

// ============================================================
// Navegação
// ============================================================

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const sectionId = link.getAttribute('href').slice(1);
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    });
});

// ============================================================
// Clientes
// ============================================================

async function loadClients() {
    const container = document.getElementById('clients-list');
    try {
        const clients = await request('/api/clients');
        if (!clients || clients.length === 0) {
            container.innerHTML = '<p class="list-empty">Nenhum cliente cadastrado.</p>';
            return;
        }
        container.innerHTML = clients.map(c => `
            <div class="item">
                <div>
                    <div class="item-label">Nome</div>
                    <div class="item-value">${escapeHtml(c.nome)}</div>
                </div>
                <div>
                    <div class="item-label">CPF</div>
                    <div class="item-value">${escapeHtml(c.cpf)}</div>
                </div>
                <div>
                    <div class="item-label">Email</div>
                    <div class="item-value">${escapeHtml(c.email)}</div>
                </div>
                <div>
                    <div class="item-label">Telefone</div>
                    <div class="item-value">${escapeHtml(c.telefone)}</div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<p class="list-empty" style="color:var(--danger)">Erro: ${err.message}</p>`;
        showToast(err.message, 'error');
    }
}

document.getElementById('client-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        nome: document.getElementById('client-nome').value.trim(),
        cpf: document.getElementById('client-cpf').value.trim(),
        telefone: document.getElementById('client-telefone').value.trim(),
        email: document.getElementById('client-email').value.trim(),
        endereco: document.getElementById('client-endereco').value.trim(),
    };

    try {
        await request('/api/clients', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        showToast('Cliente cadastrado com sucesso!');
        e.target.reset();
        loadClients();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// ============================================================
// Aluguéis
// ============================================================

async function loadRentals() {
    const container = document.getElementById('rentals-list');
    try {
        const rentals = await request('/api/rentals');
        if (!rentals || rentals.length === 0) {
            container.innerHTML = '<p class="list-empty">Nenhum aluguel encontrado.</p>';
            return;
        }
        container.innerHTML = rentals.map(r => `
            <div class="item">
                <div>
                    <div class="item-label">ID</div>
                    <div class="item-value">#${r.id}</div>
                </div>
                <div>
                    <div class="item-label">Cliente ID</div>
                    <div class="item-value">${r.client?.id ?? 'N/A'}</div>
                </div>
                <div>
                    <div class="item-label">Valor</div>
                    <div class="item-value">R$ ${r.rentValue?.toFixed(2) ?? 'N/A'}</div>
                </div>
                <div>
                    <div class="item-label">Status</div>
                    <span class="item-status status-${r.status?.toLowerCase()}">${r.status ?? 'N/A'}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<p class="list-empty" style="color:var(--danger)">Erro: ${err.message}</p>`;
        showToast(err.message, 'error');
    }
}

document.getElementById('rental-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        clientCpf: document.getElementById('rental-cpf').value.trim(),
        carName: document.getElementById('rental-car-name').value.trim(),
        carModelType: document.getElementById('rental-car-type').value.trim(),
        rentValue: parseFloat(document.getElementById('rental-value').value),
    };

    try {
        await request('/api/rentals', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        showToast('Aluguel criado com sucesso!');
        e.target.reset();
        loadRentals();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// ============================================================
// Pagamentos
// ============================================================

async function loadPayments() {
    const container = document.getElementById('payments-list');
    try {
        const payments = await request('/payments');
        if (!payments || payments.length === 0) {
            container.innerHTML = '<p class="list-empty">Nenhum pagamento encontrado.</p>';
            return;
        }
        container.innerHTML = payments.map(p => `
            <div class="item">
                <div>
                    <div class="item-label">ID</div>
                    <div class="item-value">#${p.id}</div>
                </div>
                <div>
                    <div class="item-label">Aluguel ID</div>
                    <div class="item-value">${p.rent?.id ?? p.rentId ?? 'N/A'}</div>
                </div>
                <div>
                    <div class="item-label">Valor</div>
                    <div class="item-value">R$ ${p.valorPago?.toFixed(2) ?? 'N/A'}</div>
                </div>
                <div>
                    <div class="item-label">Método</div>
                    <div class="item-value">${p.metodoPagamento ?? 'N/A'}</div>
                </div>
                <div>
                    <div class="item-label">Status</div>
                    <span class="item-status status-${p.status?.toLowerCase()}">${p.status ?? 'N/A'}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<p class="list-empty" style="color:var(--danger)">Erro: ${err.message}</p>`;
        showToast(err.message, 'error');
    }
}

document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        rentId: parseInt(document.getElementById('payment-rent-id').value),
        valorPago: parseFloat(document.getElementById('payment-valor').value),
        metodoPagamento: document.getElementById('payment-metodo').value,
    };

    try {
        const result = await request('/payments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        showToast('Pagamento realizado com sucesso!', 'success');
        e.target.reset();
        loadPayments();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// ============================================================
// Utils
// ============================================================

function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Carregar dados ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    loadClients();
    loadRentals();
    loadPayments();
});
