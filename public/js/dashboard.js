// Mock data generation
function generateMockData(days = 30) {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        data.push({
            timestamp: date.toISOString(),
            api_calls: Math.floor(Math.random() * 3500) + 5000,
            response_time: Math.floor(Math.random() * 75) + 75,
            error_rate: (Math.random() * 0.7 + 0.1).toFixed(2),
            active_keys: Math.floor(Math.random() * 120) + 800
        });
    }
    
    return data.reverse();
}

// Chart configuration
const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.parsed.y.toLocaleString();
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                grid: {
                    display: false
                },
                ticks: {
                    color: '#94a3b8'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9'
                },
                ticks: {
                    color: '#94a3b8'
                }
            }
        }
    }
};

// Initialize charts
function initializeCharts() {
    const mockData = generateMockData();
    
    // API Usage Trends
    const apiUsageCtx = document.getElementById('apiUsageTrends').getContext('2d');
    window.apiUsageChart = new Chart(apiUsageCtx, {
        ...chartConfig,
        data: {
            labels: mockData.map(d => d.timestamp),
            datasets: [{
                label: 'API Calls',
                data: mockData.map(d => d.api_calls),
                borderColor: '#3b82f6',
                backgroundColor: createGradient(apiUsageCtx, '#3b82f6'),
                tension: 0.4,
                fill: true
            }]
        }
    });
    
    // Response Time Trends
    const responseTimeCtx = document.getElementById('responseTimeTrends').getContext('2d');
    window.responseTimeChart = new Chart(responseTimeCtx, {
        ...chartConfig,
        data: {
            labels: mockData.map(d => d.timestamp),
            datasets: [{
                label: 'Response Time (ms)',
                data: mockData.map(d => d.response_time),
                borderColor: '#10b981',
                backgroundColor: createGradient(responseTimeCtx, '#10b981'),
                tension: 0.4,
                fill: true,
                hidden: true
            }]
        }
    });
    
    // Error Rate
    const errorRateCtx = document.getElementById('errorRate').getContext('2d');
    new Chart(errorRateCtx, {
        ...chartConfig,
        data: {
            labels: mockData.map(d => d.timestamp),
            datasets: [{
                label: 'Error Rate (%)',
                data: mockData.map(d => d.error_rate),
                borderColor: '#ef4444',
                backgroundColor: createGradient(errorRateCtx, '#ef4444'),
                tension: 0.4,
                fill: true
            }]
        }
    });
    
    // Active API Keys
    const activeKeysCtx = document.getElementById('activeKeys').getContext('2d');
    new Chart(activeKeysCtx, {
        ...chartConfig,
        data: {
            labels: mockData.map(d => d.timestamp),
            datasets: [{
                label: 'Active Keys',
                data: mockData.map(d => d.active_keys),
                borderColor: '#8b5cf6',
                backgroundColor: createGradient(activeKeysCtx, '#8b5cf6'),
                tension: 0.4,
                fill: true
            }]
        }
    });
}

// Create gradient background
function createGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color + '20');
    gradient.addColorStop(1, color + '05');
    return gradient;
}

// Handle time range selection
function handleTimeRange(days) {
    const mockData = generateMockData(days);
    
    // Update all charts with new data
    const charts = [
        window.apiUsageChart,
        window.responseTimeChart
    ];
    
    charts.forEach(chart => {
        if (chart) {
            chart.data.labels = mockData.map(d => d.timestamp);
            chart.data.datasets[0].data = mockData.map(d => {
                if (chart === window.apiUsageChart) return d.api_calls;
                return d.response_time;
            });
            chart.update();
        }
    });
    
    // Update active button state
    document.querySelectorAll('.time-range-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.days === days.toString()) {
            btn.classList.add('active');
        }
    });
}

// Handle API trend toggles
function handleTrendToggle(type) {
    const apiCallsBtn = document.getElementById('apiCallsBtn');
    const responseTimeBtn = document.getElementById('responseTimeBtn');
    
    if (type === 'apiCalls') {
        apiCallsBtn.classList.add('active');
        responseTimeBtn.classList.remove('active');
        window.apiUsageChart.data.datasets[0].hidden = false;
        window.responseTimeChart.data.datasets[0].hidden = true;
    } else {
        apiCallsBtn.classList.remove('active');
        responseTimeBtn.classList.add('active');
        window.apiUsageChart.data.datasets[0].hidden = true;
        window.responseTimeChart.data.datasets[0].hidden = false;
    }
    
    window.apiUsageChart.update();
    window.responseTimeChart.update();
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    
    // Add event listeners for time range buttons
    document.querySelectorAll('.time-range-btn').forEach(btn => {
        btn.addEventListener('click', () => handleTimeRange(parseInt(btn.dataset.days)));
    });
    
    // Add event listeners for trend toggle buttons
    document.getElementById('apiCallsBtn').addEventListener('click', () => handleTrendToggle('apiCalls'));
    document.getElementById('responseTimeBtn').addEventListener('click', () => handleTrendToggle('responseTime'));
});
