const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const currency = n => {
  if (isNaN(n) || !isFinite(n)) return "R$ 0,00";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

let produtos = [];
let nextId = 1;
let chart = null;

const produtosBody = $("#produtosBody");
const btnAdd = $("#btnAdd");
const btnCalcular = $("#btnCalcular");
const btnExport = $("#btnExport");
const custoFixoInput = $("#custoFixo");
const receitaAtualEl = $("#receitaAtual");
const mcTotalEl = $("#mcTotal");
const rpeEl = $("#rpe");
const progressBar = $("#progressBar");
const pctEl = $("#pct");
const insightsEl = $("#insights");
const periodoSelect = $("#periodo");
const ctx = document.getElementById("chart").getContext("2d");

function criarProdutoLinha(p) {
  const tr = document.createElement("tr");
  tr.dataset.id = p.id;

  tr.innerHTML = `
    <td><input class="nome" value="${p.name}" style="width:120px"></td>
    <td><input class="cv" type="number" step="0.01" value="${p.cv || ''}" placeholder="0.00"></td>
    <td><input class="pv" type="number" step="0.01" value="${p.pv || ''}" placeholder="0.00"></td>
    <td><input class="qtd" type="number" step="1" value="${p.qtd || ''}" placeholder="0"></td>
    <td class="mcunit">-</td>
    <td class="receita">-</td>
    <td><button class="remove">Remover</button></td>
  `;

  const inputs = tr.querySelectorAll("input");
  inputs.forEach(inp => {
    inp.addEventListener("input", () => {
      const id = Number(tr.dataset.id);
      const prod = produtos.find(x => x.id === id);
      if (!prod) return;
      prod.name = tr.querySelector(".nome").value.trim() || prod.name;
      prod.cv = parseFloat(tr.querySelector(".cv").value) || 0;
      prod.pv = parseFloat(tr.querySelector(".pv").value) || 0;
      prod.qtd = parseFloat(tr.querySelector(".qtd").value) || 0;
      atualizarLinha(tr, prod);
      calcularEAtualizar(false);
    });
  });

  tr.querySelector(".remove").addEventListener("click", () => {
    const id = Number(tr.dataset.id);
    produtos = produtos.filter(p => p.id !== id);
    tr.remove();
    calcularEAtualizar(false);
  });

  return tr;
}

function atualizarLinha(tr, prod) {
  const mcUnit = +(prod.pv - prod.cv);
  const receita = +(prod.pv * prod.qtd);
  tr.querySelector(".mcunit").textContent = isFinite(mcUnit) ? currency(mcUnit) : "-";
  tr.querySelector(".receita").textContent = isFinite(receita) ? currency(receita) : "-";
}

function adicionarProduto(name = `Produto ${nextId}`, cv = 0, pv = 0, qtd = 0) {
  const prod = { id: nextId++, name, cv, pv, qtd };
  produtos.push(prod);
  const tr = criarProdutoLinha(prod);
  produtosBody.appendChild(tr);
  atualizarLinha(tr, prod);
}

// Adicionamos 5 produtos iniciais para facilitar o seu teste, seguindo o arquivo word.
for (let i = 0; i < 5; i++) adicionarProduto(`Produto ${i + 1}`);

// ---------- Cálculo (mix de produtos) ----------
function calcularRPE(produtosList, custoFixo) {
  // MC unitário = PV - CV
  // MC total = sum(mc_unit * qtd)
  // Receita total = sum(pv * qtd)
  // IMC = MC total / Receita total
  // RPE (receita) = custoFixo / IMC

  let receitaTotal = 0;
  let mcTotal = 0;

  produtosList.forEach(p => {
    const cv = Number(p.cv) || 0;
    const pv = Number(p.pv) || 0;
    const qtd = Number(p.qtd) || 0;
    const mcUnit = pv - cv;
    receitaTotal += pv * qtd;
    mcTotal += mcUnit * qtd;
  });

  if (receitaTotal <= 0 || mcTotal <= 0) return { receitaTotal, mcTotal, imc: 0, rpe: Infinity };

  const imc = mcTotal / receitaTotal;
  const rpe = custoFixo / imc;

  return { receitaTotal, mcTotal, imc, rpe };
}

function calcularEAtualizar(animar = true) {
  const custoFixo = parseFloat(custoFixoInput.value) || 0;
  const periodo = periodoSelect.value;

  const res = calcularRPE(produtos, custoFixo);

  receitaAtualEl.textContent = currency(res.receitaTotal);
  mcTotalEl.textContent = currency(res.mcTotal);
  rpeEl.textContent = isFinite(res.rpe) ? currency(res.rpe) : "—";

  let pct = 0;
  if (isFinite(res.rpe) && res.rpe > 0 && res.receitaTotal > 0) {
    pct = Math.min(100, Math.round((res.receitaTotal / res.rpe) * 100));
  } else {
    pct = 0;
  }

  progressBar.style.width = `${pct}%`;
  pctEl.textContent = `${pct}%`;

  let insightsHtml = "";
  if (!isFinite(res.rpe) || res.imc === 0) {
    insightsHtml = `<p>Preencha custos, preços e quantidades válidas para calcular o ponto de equilíbrio.</p>`;
  } else {
    insightsHtml = `
      <p><strong>IMC (Índice da Margem de Contribuição):</strong> ${(res.imc * 100).toFixed(2)}%</p>
      <p><strong>Receita atual:</strong> ${currency(res.receitaTotal)} — você precisa alcançar <strong>${currency(res.rpe)}</strong> para cobrir custos fixos de ${currency(custoFixo)}.</p>
    `;

    if (res.receitaTotal < res.rpe) {
      const faltante = res.rpe - res.receitaTotal;
      insightsHtml += `<p style="color:#ffb86b"><strong>Você está R$ ${faltante.toFixed(2)} abaixo</strong> da RPE. Considere aumentar preço, reduzir CV, ou vender mais unidades.</p>`;
    } else {
      insightsHtml += `<p style="color:var(--success)"><strong>Parabéns!</strong> Sua receita atual ultrapassa a RPE.</p>`;
    }
  }
  insightsEl.innerHTML = insightsHtml;

  atualizarGrafico(res);

  const rpeCard = rpeEl.parentElement;
  if (pct >= 100) {
    rpeEl.animate([{ transform: "scale(1)" }, { transform: "scale(1.03)" }, { transform: "scale(1)" }], { duration: 900 });
  }
}

function criarGrafico() {
  if (chart) chart.destroy();

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(59,130,246,0.45)');
  gradient.addColorStop(1, 'rgba(110,231,183,0.08)');

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: produtos.map(p => p.name),
      datasets: [{
        label: 'Receita por Produto',
        data: produtos.map(p => (Number(p.pv) || 0) * (Number(p.qtd) || 0)),
        backgroundColor: gradient,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          ticks: {
            callback: v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          },
          grid: { color: 'rgba(255,255,255,0.03)' }
        }
      }
    }
  });
}

function atualizarGrafico(calcRes) {
  if (!chart) criarGrafico();

  chart.data.labels = produtos.map(p => p.name);
  chart.data.datasets[0].data = produtos.map(p => (Number(p.pv) || 0) * (Number(p.qtd) || 0));

  const rpeValue = isFinite(calcRes.rpe) ? calcRes.rpe : 0;
  const lineData = produtos.map(() => rpeValue / Math.max(1, produtos.length));


  if (chart.data.datasets.length > 1) {
    chart.data.datasets.splice(1, 1);
  }

  chart.data.datasets.push({
    type: 'line',
    label: 'RPE (distribuída)',
    data: lineData,
    borderColor: '#ffb86b',
    borderWidth: 2,
    pointRadius: 0,
    borderDash: [6, 6],
    fill: false,
  });

  chart.update('active');
}


function exportCSV() {
  if (produtos.length === 0) return alert("Sem produtos para exportar.");
  const header = ["Produto","CV","PV","Quantidade","MC Unit","Receita"].join(";");
  const rows = produtos.map(p => {
    const mc = (Number(p.pv) - Number(p.cv)) || 0;
    const receita = (Number(p.pv) * Number(p.qtd)) || 0;
    return [p.name, p.cv.toFixed(2), p.pv.toFixed(2), p.qtd, mc.toFixed(2), receita.toFixed(2)].join(";");
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ponto_equilibrio_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


btnAdd.addEventListener("click", () => {
  adicionarProduto();
  criarGrafico();
});

btnCalcular.addEventListener("click", () => {
  calcularEAtualizar();
});

btnExport.addEventListener("click", () => {
  exportCSV();
});


document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    calcularEAtualizar();
  }
});


criarGrafico();
calcularEAtualizar(false);

