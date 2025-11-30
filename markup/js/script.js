function custoVendaUnitario() {
    const materiaPrima = parseFloat(document.getElementById('mp').value);
    const materiaisSecundarios = parseFloat(document.getElementById('ms').value);
    const materialEmbalagem = parseFloat(document.getElementById('me').value);
    const maoDeObra = parseFloat(document.getElementById('mo').value);
    const resultadoCDVU = document.getElementById('resultadoCustoDeVendaUnitario');

    if (
        isNaN(materiaPrima) || isNaN(materiaisSecundarios) ||
        isNaN(materialEmbalagem) || isNaN(maoDeObra)
    ) {
        resultadoCDVU.textContent = "Preencha todos os campos corretamente.";
        return null;
    }

    const total = materiaPrima + materiaisSecundarios + materialEmbalagem + maoDeObra;
    resultadoCDVU.textContent = `Custo de Venda Unitário: ${total.toFixed(2)}`;
    return total;
}
function somatorioPercentuais() {
    const comissaoVendedores = parseFloat(document.getElementById('cv').value);
    const impostoPrecoVenda = parseFloat(document.getElementById('ipv').value);
    const impostosLucro = parseFloat(document.getElementById('il').value);
    const custosFixos = parseFloat(document.getElementById('cf').value);
    const despesasFixas = parseFloat(document.getElementById('df').value);
    const margemLucro = parseFloat(document.getElementById('ml').value);

    const resultadoEl = document.getElementById('resultadoSomatorioPercentuais');

    if (
        isNaN(comissaoVendedores) || isNaN(impostoPrecoVenda) || isNaN(impostosLucro) ||
        isNaN(custosFixos) || isNaN(despesasFixas) || isNaN(margemLucro)
    ) {
        resultadoEl.textContent = "Preencha todos os campos corretamente.";
        return null;
    }

    const somatorio = 
        comissaoVendedores +
        impostoPrecoVenda +
        impostosLucro +
        custosFixos +
        despesasFixas +
        margemLucro;

    resultadoEl.textContent = `Somatório dos Percentuais: ${somatorio.toFixed(2)}%`;
    return somatorio;
}
function subtrairPercentual(somatorio) {
    const resultado = 100 - somatorio;
    document.getElementById('resultadoSubtrairPercentual').textContent =
        `Subtração do Percentual: ${resultado.toFixed(2)}%`;
    return resultado;
}

function dividirPercentual(percentualRestante) {
    const resultado = 100 / percentualRestante;
    document.getElementById('resultadoDividirPercentual').textContent =
        `Divisão do Percentual (Markup): ${resultado.toFixed(2)}`;
    return resultado;
}

function precoDeVenda(custoVendaUnitario, dividirPercentual) {
    const resultadoEl = document.getElementById('resultadoPrecoDeVenda');

    // Validação
    if (isNaN(custoVendaUnitario) || isNaN(dividirPercentual)) {
        resultadoEl.textContent = "Erro: cálculos anteriores não foram realizados corretamente.";
        return null;
    }

    const resultadoPV = custoVendaUnitario * dividirPercentual;

    resultadoEl.textContent = `Preço de Venda: ${resultadoPV.toFixed(2)}`;
    return resultadoPV;
}


function todoso() {
    const custo = custoVendaUnitario();
    const soma = somatorioPercentuais();

    if (custo === null || soma === null) return;

    const restante = subtrairPercentual(soma);  
    const divisor = dividirPercentual(restante); 

    precoDeVenda(custo, divisor);               
}
function custoVendaUnitarioDivisor() {
    const materiaPrima = parseFloat(document.getElementById('mpd').value);
    const materiaisSecundarios = parseFloat(document.getElementById('msd').value);
    const materialEmbalagem = parseFloat(document.getElementById('med').value);
    const maoDeObra = parseFloat(document.getElementById('mod').value);
    const resultadoCDVU = document.getElementById('resultadoCustoDeVendaUnitarioDivisor');

    if (
        isNaN(materiaPrima) || isNaN(materiaisSecundarios) ||
        isNaN(materialEmbalagem) || isNaN(maoDeObra)
    ) {
        resultadoCDVU.textContent = "Preencha todos os campos corretamente.";
        return null;
    }

    const total = materiaPrima + materiaisSecundarios + materialEmbalagem + maoDeObra;
    resultadoCDVU.textContent = `Custo de Venda Unitário: ${total.toFixed(2)}`;
    return total;
}

function somatorioPercentuaisDivisor() {
    const comissaoVendedores = parseFloat(document.getElementById('cvd').value);
    const impostoPrecoVenda = parseFloat(document.getElementById('ipvd').value);
    const impostosLucro = parseFloat(document.getElementById('ild').value);
    const custosFixos = parseFloat(document.getElementById('cfd').value);
    const despesasFixas = parseFloat(document.getElementById('dfd').value);
    const margemLucro = parseFloat(document.getElementById('mld').value);

    const resultadoEl = document.getElementById('resultadoSomatorioPercentuaisDivisor');

    if (
        isNaN(comissaoVendedores) || isNaN(impostoPrecoVenda) || 
        isNaN(impostosLucro) || isNaN(custosFixos) ||
        isNaN(despesasFixas) || isNaN(margemLucro)
    ) {
        resultadoEl.textContent = "Preencha todos os campos corretamente.";
        return null;
    }

    // Convertendo para decimal: ex: 60% vira 0.60
    const somatorioPercentual = 
        comissaoVendedores +
        impostoPrecoVenda +
        impostosLucro +
        custosFixos +
        despesasFixas +
        margemLucro;

    resultadoEl.textContent = `Somatório dos Percentuais: ${somatorioPercentual}%`;
    return somatorioPercentual;
}

function precoDeVendaDivisor(custoVendaUnitario, markupDivisor) {
    const resultadoEl = document.getElementById('resultadoPrecoDeVendaDivisor');

    if (isNaN(custoVendaUnitario) || isNaN(markupDivisor)) {
        resultadoEl.textContent = "Erro: cálculos anteriores não foram realizados corretamente.";
        return null;
    }

    const precoDeVenda = custoVendaUnitario / markupDivisor;

    resultadoEl.textContent = `Preço de Venda (Divisor): R$ ${precoDeVenda.toFixed(2)}`;
    return precoDeVenda;
}


function todos() {
    const custo = custoVendaUnitarioDivisor();
    const somaPercentuais = somatorioPercentuaisDivisor();

    if (custo === null || somaPercentuais === null) return;

    const decimal = somaPercentuais / 100;  

    const markupDivisor = 1 - decimal;     

    document.getElementById('resultadoSubtrairPercentualDivisor').textContent =
        `1 - ${decimal.toFixed(2)} = ${markupDivisor.toFixed(2)}`;

    document.getElementById('resultadoDividirPercentualDivisor').textContent =
        `Markup Divisor: ${markupDivisor.toFixed(2)}`;

    precoDeVendaDivisor(custo, markupDivisor);
}
function voltar() {
    window.history.back();

}