// Função para alternar as seções
function mostrarSecao(secaoId) {
    const secoes = document.querySelectorAll('.secao');
    secoes.forEach(secao => secao.classList.remove('ativa'));
    document.getElementById(secaoId).classList.add('ativa');
}

// Calcular Ponto de Equilíbrio
function calcularPE() {
    const gastoFixo = parseFloat(document.getElementById('gastoFixo').value);
    const precoVenda = parseFloat(document.getElementById('precoVenda').value);
    const gastoVariavel = parseFloat(document.getElementById('gastoVariavel').value);
    const resultado = document.getElementById('resultadoPE');

    if (isNaN(gastoFixo) || isNaN(precoVenda) || isNaN(gastoVariavel)) {
        resultado.textContent = "Preencha todos os campos corretamente.";
        return;
    }

    const pe = gastoFixo / (precoVenda - gastoVariavel);
    resultado.textContent = `Ponto de Equilíbrio: ${pe.toFixed(2)} unidades.`;
}

// Calcular Lucratividade
function calcularLucratividade() {
    const lucro = parseFloat(document.getElementById('lucro').value);
    const receita = parseFloat(document.getElementById('receitaVenda').value);
    const resultado = document.getElementById('resultadoLucratividade');

    if (isNaN(lucro) || isNaN(receita) || receita === 0) {
        resultado.textContent = "Preencha os campos corretamente.";
        return;
    }

    const lucratividade = (lucro / receita) * 100;
    resultado.textContent = `Lucratividade: ${lucratividade.toFixed(2)}%`;
}

// Calcular Rentabilidade
function calcularRentabilidade() {
    const lucro = parseFloat(document.getElementById('lucroRent').value);
    const capital = parseFloat(document.getElementById('capitalInvestido').value);
    const resultado = document.getElementById('resultadoRentabilidade');

    if (isNaN(lucro) || isNaN(capital) || capital === 0) {
        resultado.textContent = "Preencha os campos corretamente.";
        return;
    }

    const rentabilidade = (lucro / capital) * 100;
    resultado.textContent = `Rentabilidade: ${rentabilidade.toFixed(2)}%`;
}

// Configurar gráfico de resultados
function configurarGrafico() {
    const ctx = document.getElementById('resultChart').getContext('2d');
    const resultChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ponto de Equilíbrio', 'Lucratividade', 'Rentabilidade'],
            datasets: [{
                label: 'Resultados',
                data: [12, 19, 3], // Dados de exemplo
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }}
        }
    });
}
