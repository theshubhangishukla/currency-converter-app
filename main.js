// Get free API key from: https://www.exchangerate-api.com/
const API_KEY = '5c7d3200531ca41319273771'; 
const BASE_URL = `https://v6.exchangerate-api.com/v6/5c7d3200531ca41319273771/latest/USD`;

// State Manager
const state = {
    rates: null,
    lastUpdated: null,
    baseCurrency: 'USD',
    targetCurrency: 'EUR'
};

// Theme management (place this near the top with your other state management)

// Initialize theme (add this to your initialization function)
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', ({
            current: localStorage.getItem('theme') || 'light',
            toggle() {
                this.current = this.current === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', this.current);
                document.documentElement.setAttribute('data-theme', this.current);
            }
        }).current);
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        ({
            current: localStorage.getItem('theme') || 'light',
            toggle() {
                this.current = this.current === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', this.current);
                document.documentElement.setAttribute('data-theme', this.current);
            }
        }).toggle();
    });
}

// Update your initialization IIFE to include theme initialization
(async () => {
    try {
        showLoading();
        await fetchRates();
        populateCurrencies();
        setupEventListeners();
        initializeTheme(); // Add this line
        performConversion();
        startRateChangeSimulation();
    } catch (error) {
        showError(error);
    } finally {
        hideLoading();
    }
})();


// DOM Elements
const elements = {
    amount: document.getElementById('amount'),
    baseCurrency: document.getElementById('base-currency'),
    targetCurrency: document.getElementById('target-currency-select'),
    resultsBody: document.getElementById('results-body'),
    loadingSpinner: document.querySelector('.loading-spinner'),
    timestamp: document.getElementById('timestamp'),
    searchInput: document.getElementById('target-currency')
};

// Initialize Application
(async () => {
    try {
        showLoading();
        await fetchRates();
        populateCurrencies();
        setupEventListeners();
        performConversion();
    } catch (error) {
        showError(error);
    } finally {
        hideLoading();
    }
})();

// API Functions
async function fetchRates() {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('Network response failed');
    
    const data = await response.json();
    if (data.result !== 'success') throw new Error(data['error-type']);
    
    state.rates = data.conversion_rates;
    state.lastUpdated = data.time_last_update_utc;
    elements.timestamp.textContent = new Date(state.lastUpdated).toLocaleString();
}

// DOM Functions
function populateCurrencies() {
    const currencies = Object.keys(state.rates).sort();
    
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        
        elements.baseCurrency.appendChild(option.cloneNode(true));
        elements.targetCurrency.appendChild(option);
    });
}

function performConversion() {
    const amount = parseFloat(elements.amount.value);
    if (!amount || amount <= 0) return;
    
    const results = Object.entries(state.rates).map(([currency, rate]) => ({
        currency,
        value: (amount * rate).toFixed(4)
    }));
    
    renderResults(results);
}

function renderResults(results) {
    elements.resultsBody.innerHTML = results
        .map(result => `
            <tr>
                <td>${result.currency}</td>
                <td>${result.currency}</td>
                <td>${result.value}</td>
                <td><span class="change-value">--</span></td>
            </tr>
        `).join('');
}

// Event Handlers
function setupEventListeners() {
    elements.amount.addEventListener('input', debounce(performConversion, 300));
    elements.baseCurrency.addEventListener('change', handleBaseChange);
    elements.targetCurrency.addEventListener('change', handleTargetChange);
    elements.searchInput.addEventListener('input', handleSearch);
    // Theme management
const theme = {
    current: localStorage.getItem('theme') || 'light',
    toggle() {
        this.current = this.current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.current);
        document.documentElement.setAttribute('data-theme', this.current);
    }
};

// Initialize theme
document.documentElement.setAttribute('data-theme', theme.current);

}

function handleBaseChange(e) {
    state.baseCurrency = e.target.value;
    performConversion();
}

function handleTargetChange(e) {
    state.targetCurrency = e.target.value;
    performConversion();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toUpperCase();
    const options = Array.from(elements.targetCurrency.options);
    
    options.forEach(option => {
        option.hidden = !option.text.includes(searchTerm);
    });
}

// Utilities
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

function showLoading() {
    elements.loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingSpinner.classList.add('hidden');
}

function showError(error) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-banner';
    errorEl.textContent = `Error: ${error.message}`;
    document.body.prepend(errorEl);
    
    setTimeout(() => errorEl.remove(), 5000);
}

function convertCurrency(amount, fromCurrency, toCurrency, rates) {
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    return (amount / fromRate) * toRate;
}
// Add this function near your other utility functions
function getRandomChange() {
    // Generate a random change between -2% and +2%
    const change = (Math.random() * 4 - 2).toFixed(2);
    return {
        value: change,
        direction: change >= 0 ? 'positive' : 'negative'
    };
}

// Replace your existing renderResults function with this one
function renderResults(results) {
    elements.resultsBody.innerHTML = results
        .map(result => {
            const change = getRandomChange();
            return `
                <tr>
                    <td>${result.currency}</td>
                    <td>${result.currency}</td>
                    <td>${result.value}</td>
                    <td>
                        <span class="change-value ${change.direction}">
                            ${change.value}%
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
}

// Add this function to simulate periodic rate changes
function startRateChangeSimulation() {
    setInterval(() => {
        if (elements.resultsBody.children.length > 0) {
            Array.from(elements.resultsBody.children).forEach(row => {
                const changeCell = row.querySelector('.change-value');
                const change = getRandomChange();
                changeCell.className = `change-value ${change.direction}`;
                changeCell.textContent = `${change.value}%`;
            });
        }
    }, 5000); // Update every 5 seconds
}

// Add this line to your initialization function (the async IIFE)
(async () => {
    try {
        showLoading();
        await fetchRates();
        populateCurrencies();
        setupEventListeners();
        performConversion();
        startRateChangeSimulation(); // Add this line
    } catch (error) {
        showError(error);
    } finally {
        hideLoading();
    }
})();


// Export for testing if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { convertCurrency };
}

// Theme management
const theme = {
    current: localStorage.getItem('theme') || 'light',
    toggle() {
        this.current = this.current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.current);
        document.documentElement.setAttribute('data-theme', this.current);
    }
};

// Initialize theme
document.documentElement.setAttribute('data-theme', ({
        current: localStorage.getItem('theme') || 'light',
        toggle() {
            this.current = this.current === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', this.current);
            document.documentElement.setAttribute('data-theme', this.current);
        }
    }).current);
