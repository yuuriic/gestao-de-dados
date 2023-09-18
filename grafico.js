let categoriesData = {};

// Função para atualizar o gráfico de pizza (doughnut chart) na página
function updateChart() {
    const ctx = document.getElementById("categoryChart").getContext("2d");

    if (window.categoryChart) {
        categoriesData = calculateCategoriesData(); 
        window.categoryChart.data.datasets[0].data = Object.values(categoriesData);
        window.categoryChart.update(); 
    } else {
        categoriesData = calculateCategoriesData(); 
        window.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoriesData),
                datasets: [{
                    data: Object.values(categoriesData),
                    backgroundColor: getRandomColors(Object.keys(categoriesData).length),
                }],
            },
        });
    }
}

// Evento "DOMContentLoaded" que é acionado quando a página HTML é completamente carregada
document.addEventListener("DOMContentLoaded", function () {
    const incomesSpan = document.querySelector(".incomes");
    const expensesSpan = document.querySelector(".expenses");
    const totalSpan = document.querySelector(".total");

    // Função para calcular os valores das categorias com base nos itens da tabela
    function calculateCategoriesData() {
        const categoriesData = {}; 
    
        // Iterar pelos itens da tabela e calcular os valores das categorias
        items.forEach((item) => {
            const category = item.category;
            const amount = parseFloat(item.amount);
            const type = item.type;

            // Verifica se o valor não é um NaN (não é um número inválido)
            if (!isNaN(amount)) {
                if (type === "Entrada") {
                    if (categoriesData[category] === undefined) {
                        categoriesData[category] = amount;
                    } else {
                        categoriesData[category] += amount;
                    }
                } else if (type === "Saída") {
                    if (categoriesData[category] === undefined) {
                        categoriesData[category] = -amount; 
                    } else {
                        categoriesData[category] -= amount; 
                    }
                }
            }
        });
    
        // Retorna o objeto com os valores das categorias calculados
        return categoriesData;
    }

    // Função para atualizar os valores do resumo (total de entradas, saídas e saldo)
    function updateSummary() {
        const categoriesData = calculateCategoriesData();

        let totalIncomes = 0;
        let totalExpenses = 0;

        // Itera pelas categorias no objeto categoriesData
        for (const category in categoriesData) {
            if (categoriesData.hasOwnProperty(category)) {
                if (categoriesData[category] > 0) {
                    totalIncomes += categoriesData[category];
                } else {
                    totalExpenses += Math.abs(categoriesData[category]);
                }
            }
        }

        // Atualiza os elementos HTML com os totais formatados com duas casas decimais
        incomesSpan.textContent = totalIncomes.toFixed(2);
        expensesSpan.textContent = totalExpenses.toFixed(2);
        totalSpan.textContent = (totalIncomes - totalExpenses).toFixed(2);
    }

    // Função para atualizar o gráfico de rosca
    function updateChart() {
        const categoriesData = calculateCategoriesData();

        const ctx = document.getElementById("categoryChart").getContext("2d");

        // Cria um novo gráfico de rosca usando a biblioteca Chart.js
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoriesData),
                datasets: [{
                    data: Object.values(categoriesData),
                    backgroundColor: getRandomColors(Object.keys(categoriesData).length),
                }],
            },
        });
    }

    // Função para gerar cores aleatórias para o gráfico
    function getRandomColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            colors.push(color);
        }
        return colors;
    }

    updateSummary();
    updateChart();

    // Função para adicionar um item
    function addItem(category, amount) {
        categoriesData = calculateCategoriesData(); 
        categoriesData[category] = (categoriesData[category] || 0) + amount;
        updateSummary();
        updateChart();
    }

    // Função para deletar um item
    function deleteItem(category, amount) {
        categoriesData = calculateCategoriesData();
        if (categoriesData[category]) {
            categoriesData[category] = Math.max(0, categoriesData[category] - amount);
            updateSummary();
            updateChart();
        }
    }

    // Evento para adicionar um item quando o botão "Incluir" for clicado
    document.getElementById("new").addEventListener("click", function () {
        openModal();
    });

    // Evento para excluir um item quando o botão "Excluir" for clicado
    document.getElementById("deleteItem").addEventListener("click", function () {
        deleteItem('Outros', 5.00);
    });

    // Observar as mudanças na tabela de itens usando MutationObserver
    const table = document.getElementById("minhaTabela"); 
    const observer = new MutationObserver(function (mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                updateChart();
                updateSummary();
                break;
            }
        }
    });

    // Configurar a observação da tabela
    observer.observe(table, { childList: true });
});
