// Dados iniciais da aplicação
let dadosApp = {
    dadosBasicos: {
        taxaRetirada: 4,
        inflacaoAnual: 2,
        idadeAtual: 29,
        rendimentoAnual: 40000,
        despesasAnuais: 14400,
        valorInvestido: 20000
    },
    depositosDiversificados: [
        {
            id: 1,
            tipo: "ETF Global",
            valorMensal: 400,
            taxaEsperada: 8,
            dataInicio: "2025-01-01",
            dataFim: "2055-01-01",
            descricao: "VWCE"
        },
        {
            id: 2,
            tipo: "PPR",
            valorMensal: 150,
            taxaEsperada: 4,
            dataInicio: "2025-01-01",
            dataFim: "2055-01-01",
            descricao: "Stoik PPR"
        }
    ],
    eventosFinanceiros: {
        unicos: [
            {
                id: 1,
                ano: 2035,
                tipo: "Depósito",
                valor: 50000,
                descricao: "Herança"
            },
            {
                id: 2,
                ano: 2040,
                tipo: "Levantamento",
                valor: 20000,
                descricao: "Viagem"
            }
        ],
        recorrentes: [
            {
                id: 1,
                anoInicio: 2025,
                anoFim: 2050,
                periodicidade: "Anual",
                valorPeriodo: 3000,
                descricao: "Bônus",
                tipo: "Depósito"
            },
            {
                id: 2,
                anoInicio: 2025,
                anoFim: 2030,
                periodicidade: "Mensal",
                valorPeriodo: 700,
                descricao: "Aluguel do apartamento",
                tipo: "Levantamento"
            }
        ]
    },
    despesasVariaveis: [
        {
            id: 1,
            descricao: "Crédito Habitação",
            valorMensal: 800,
            anoInicio: 2025,
            anoFim: 2055
        },
        {
            id: 2,
            descricao: "Creche",
            valorMensal: 350,
            anoInicio: 2026,
            anoFim: 2031
        },
        {
            id: 3,
            descricao: "Escola Privada",
            valorMensal: 450,
            anoInicio: 2032,
            anoFim: 2043
        }
    ]
};

// -- EDITAR DEPÓSITOS --
let depositoEmEdicao = null;

// -- EDITAR DESPESAS VARIÁVEIS --
let despesaEmEdicao = null; 

// -- EDITAR EVENTOS ÚNICOS --
let eventoUnicoEmEdicao = null;

// -- EDITAR EVENTOS RECORRENTES --
let eventoRecorrenteEmEdicao = null;

// ------------------------------ GRÁFICOS ----------------------------------
let chartEvolucaoPatrimonial = null;
let chartDespesasVariaveis   = null;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
    configurarEventListeners();
    popularDadosIniciais();
    calcularResultados();
});

function inicializarApp() {
    // Configurar slider da taxa de retirada
    const taxaRetiradaSlider = document.getElementById('taxaRetirada');
    const taxaRetiradaValue = document.getElementById('taxaRetiradaValue');
    
    taxaRetiradaSlider.addEventListener('input', function() {
        taxaRetiradaValue.textContent = this.value + '%';
        dadosApp.dadosBasicos.taxaRetirada = parseFloat(this.value);
    });
}

function configurarEventListeners() {
    // Formulário dados básicos
    document.getElementById('formDadosBasicos').addEventListener('change', atualizarDadosBasicos);
    
    // Botões de ação principal
    document.getElementById('btnCalcular').addEventListener('click', calcularResultados);
    document.getElementById('btnDownloadPDF').addEventListener('click', gerarPDF);
    
    // Depósitos diversificados
    document.getElementById('btnAdicionarDeposito').addEventListener('click', mostrarFormDeposito);
    document.getElementById('btnSalvarDeposito').addEventListener('click', salvarDeposito);
    document.getElementById('btnCancelarDeposito').addEventListener('click', esconderFormDeposito);
    
    // Eventos únicos
    document.getElementById('btnAdicionarEventoUnico').addEventListener('click', mostrarFormEventoUnico);
    document.getElementById('btnSalvarEventoUnico').addEventListener('click', salvarEventoUnico);
    document.getElementById('btnCancelarEventoUnico').addEventListener('click', esconderFormEventoUnico);
    
    // Eventos recorrentes
    document.getElementById('btnAdicionarEventoRecorrente').addEventListener('click', mostrarFormEventoRecorrente);
    document.getElementById('btnSalvarEventoRecorrente').addEventListener('click', salvarEventoRecorrente);
    document.getElementById('btnCancelarEventoRecorrente').addEventListener('click', esconderFormEventoRecorrente);
    
    // Despesas variáveis
    document.getElementById('btnAdicionarDespesa').addEventListener('click', mostrarFormDespesa);
    document.getElementById('btnSalvarDespesa').addEventListener('click', salvarDespesa);
    document.getElementById('btnCancelarDespesa').addEventListener('click', esconderFormDespesa);
}

function popularDadosIniciais() {
    // Popular dados básicos
    const dadosBasicos = dadosApp.dadosBasicos;
    document.getElementById('taxaRetirada').value = dadosBasicos.taxaRetirada;
    document.getElementById('taxaRetiradaValue').textContent = dadosBasicos.taxaRetirada + '%';
    document.getElementById('inflacaoAnual').value = dadosBasicos.inflacaoAnual;
    document.getElementById('idadeAtual').value = dadosBasicos.idadeAtual;
    document.getElementById('rendimentoAnual').value = dadosBasicos.rendimentoAnual;
    document.getElementById('despesasAnuais').value = dadosBasicos.despesasAnuais;
    document.getElementById('valorInvestido').value = dadosBasicos.valorInvestido;
    
    // Popular tabelas
    atualizarTabelaDepositos();
    atualizarTabelaEventosUnicos();
    atualizarTabelaEventosRecorrentes();
    atualizarTabelaDespesasVariaveis();
}

function atualizarDadosBasicos() {
    dadosApp.dadosBasicos = {
        taxaRetirada: parseFloat(document.getElementById('taxaRetirada').value),
        inflacaoAnual: parseFloat(document.getElementById('inflacaoAnual').value),
        idadeAtual: parseInt(document.getElementById('idadeAtual').value),
        rendimentoAnual: parseFloat(document.getElementById('rendimentoAnual').value),
        despesasAnuais: parseFloat(document.getElementById('despesasAnuais').value),
        valorInvestido: parseFloat(document.getElementById('valorInvestido').value)
    };
}

// Funções para depósitos diversificados
function mostrarFormDeposito() {
    document.getElementById('formNovoDeposito').classList.remove('hidden');
}

function esconderFormDeposito() {
    document.getElementById('formNovoDeposito').classList.add('hidden');
    limparFormDeposito();
}

function limparFormDeposito() {
    document.getElementById('tipoInvestimento').value = '';
    document.getElementById('valorMensal').value = '';
    document.getElementById('taxaEsperada').value = '';
    document.getElementById('dataInicio').value = '';
    document.getElementById('dataFim').value = '';
    document.getElementById('descricaoInvestimento').value = '';

    depositoEmEdicao = null;                                 // reset
    document.getElementById('btnSalvarDeposito').textContent = 'Salvar';
}


function salvarDeposito() {
    if (depositoEmEdicao !== null) {
        // *** ACTUALIZAR EXISTENTE ***
        const dep = dadosApp.depositosDiversificados.find(d => d.id === depositoEmEdicao);
        if (dep) {
            dep.tipo         = document.getElementById('tipoInvestimento').value;
            dep.valorMensal  = parseFloat(document.getElementById('valorMensal').value);
            dep.taxaEsperada = parseFloat(document.getElementById('taxaEsperada').value);
            dep.dataInicio   = document.getElementById('dataInicio').value;
            dep.dataFim      = document.getElementById('dataFim').value;
            dep.descricao    = document.getElementById('descricaoInvestimento').value;
        }
    } else {
        // *** NOVO DEPÓSITO ***
        const novoDeposito = {
            id: Date.now(),
            tipo: document.getElementById('tipoInvestimento').value,
            valorMensal: parseFloat(document.getElementById('valorMensal').value),
            taxaEsperada: parseFloat(document.getElementById('taxaEsperada').value),
            dataInicio: document.getElementById('dataInicio').value,
            dataFim: document.getElementById('dataFim').value,
            descricao: document.getElementById('descricaoInvestimento').value
        };
        dadosApp.depositosDiversificados.push(novoDeposito);
    }

    atualizarTabelaDepositos();
    esconderFormDeposito();       // também limpa o estado de edição
}


function editarDeposito(id) {
    const dep = dadosApp.depositosDiversificados.find(d => d.id === id);
    if (!dep) return;

    // Preenche o formulário com os valores existentes
    document.getElementById('tipoInvestimento').value   = dep.tipo;
    document.getElementById('valorMensal').value        = dep.valorMensal;
    document.getElementById('taxaEsperada').value       = dep.taxaEsperada;
    document.getElementById('dataInicio').value         = dep.dataInicio;
    document.getElementById('dataFim').value            = dep.dataFim;
    document.getElementById('descricaoInvestimento').value = dep.descricao;

    depositoEmEdicao = id;                               // sinaliza modo “edição”
    document.getElementById('btnSalvarDeposito').textContent = 'Atualizar';
    mostrarFormDeposito();                               // abre o pop-up
}

function removerDeposito(id) {
    dadosApp.depositosDiversificados = dadosApp.depositosDiversificados.filter(d => d.id !== id);
    atualizarTabelaDepositos();
}

function atualizarTabelaDepositos() {
    const tbody = document.querySelector('#tabelaDepositos tbody');
    tbody.innerHTML = '';
    
    dadosApp.depositosDiversificados.forEach(deposito => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${deposito.tipo}</td>
            <td>€${deposito.valorMensal.toLocaleString()}</td>
            <td>${deposito.taxaEsperada}%</td>
            <td>${new Date(deposito.dataInicio).toLocaleDateString('pt-PT')}</td>
            <td>${new Date(deposito.dataFim).toLocaleDateString('pt-PT')}</td>
            <td>${deposito.descricao}</td>
            <td>
                <button class="btn-action btn-edit"   onclick="editarDeposito(${deposito.id})">Editar</button>
                <button class="btn-action btn-remove" onclick="removerDeposito(${deposito.id})">Remover</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    calcularTaxaRetornoPonderada();
}

function calcularTaxaRetornoPonderada() {
    let totalValor = 0;
    let somaValorada = 0;
    
    dadosApp.depositosDiversificados.forEach(deposito => {
        totalValor += deposito.valorMensal;
        somaValorada += deposito.valorMensal * deposito.taxaEsperada;
    });
    
    const taxaPonderada = totalValor > 0 ? (somaValorada / totalValor) : 0;
    document.getElementById('taxaRetornoPonderada').textContent = taxaPonderada.toFixed(2) + '%';
}

// Funções para eventos únicos
function mostrarFormEventoUnico() {
    document.getElementById('formNovoEventoUnico').classList.remove('hidden');
}

function esconderFormEventoUnico() {
    document.getElementById('formNovoEventoUnico').classList.add('hidden');
    limparFormEventoUnico();
}

function limparFormEventoUnico() {
    document.getElementById('anoEvento').value = '';
    document.getElementById('tipoEvento').value = 'Depósito';
    document.getElementById('valorEvento').value = '';
    document.getElementById('descricaoEvento').value = '';
    eventoUnicoEmEdicao = null;
    document.getElementById('btnSalvarEventoUnico').textContent = 'Salvar';
}

function salvarEventoUnico() {
    if (eventoUnicoEmEdicao !== null) {
        // — ACTUALIZAR —
        const ev = dadosApp.eventosFinanceiros.unicos.find(e => e.id === eventoUnicoEmEdicao);
        if (ev) {
            ev.ano       = parseInt(document.getElementById('anoEvento').value);
            ev.tipo      = document.getElementById('tipoEvento').value;
            ev.valor     = parseFloat(document.getElementById('valorEvento').value);
            ev.descricao = document.getElementById('descricaoEvento').value;
        }
    } else {
        // — NOVO —
        const novoEvento = {
            id: Date.now(),
            ano: parseInt(document.getElementById('anoEvento').value),
            tipo: document.getElementById('tipoEvento').value,
            valor: parseFloat(document.getElementById('valorEvento').value),
            descricao: document.getElementById('descricaoEvento').value
        };
        dadosApp.eventosFinanceiros.unicos.push(novoEvento);
    }

    atualizarTabelaEventosUnicos();
    esconderFormEventoUnico();
    eventoUnicoEmEdicao = null;
    document.getElementById('btnSalvarEventoUnico').textContent = 'Salvar';
}

function removerEventoUnico(id) {
    dadosApp.eventosFinanceiros.unicos = dadosApp.eventosFinanceiros.unicos.filter(e => e.id !== id);
    atualizarTabelaEventosUnicos();
}

function editarEventoUnico(id) {
    const ev = dadosApp.eventosFinanceiros.unicos.find(e => e.id === id);
    if (!ev) return;

    document.getElementById('anoEvento').value      = ev.ano;
    document.getElementById('tipoEvento').value     = ev.tipo;
    document.getElementById('valorEvento').value    = ev.valor;
    document.getElementById('descricaoEvento').value= ev.descricao;

    eventoUnicoEmEdicao = id;
    document.getElementById('btnSalvarEventoUnico').textContent = 'Atualizar';
    mostrarFormEventoUnico();
}

function atualizarTabelaEventosUnicos() {
    const tbody = document.querySelector('#tabelaEventosUnicos tbody');
    tbody.innerHTML = '';
    
    dadosApp.eventosFinanceiros.unicos.forEach(evento => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evento.ano}</td>
            <td>${evento.tipo}</td>
            <td>€${evento.valor.toLocaleString()}</td>
            <td>${evento.descricao}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarEventoUnico(${evento.id})">Editar</button>
                <button class="btn-action btn-remove" onclick="removerEventoUnico(${evento.id})">Remover</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Funções para eventos recorrentes
function mostrarFormEventoRecorrente() {
    document.getElementById('formNovoEventoRecorrente').classList.remove('hidden');
}

function esconderFormEventoRecorrente() {
    document.getElementById('formNovoEventoRecorrente').classList.add('hidden');
    limparFormEventoRecorrente();
}

function limparFormEventoRecorrente() {
    document.getElementById('anoInicioEvento').value = '';
    document.getElementById('anoFimEvento').value = '';
    document.getElementById('tipoEventoRecorrente').value = 'Depósito';
    document.getElementById('periodicidadeEvento').value = 'Mensal';
    document.getElementById('valorPeriodoEvento').value = '';
    document.getElementById('descricaoEventoRecorrente').value = '';
    eventoRecorrenteEmEdicao = null;
    document.getElementById('btnSalvarEventoRecorrente').textContent = 'Salvar';
}

function salvarEventoRecorrente() {
    if (eventoRecorrenteEmEdicao !== null) {
        // — ACTUALIZAR —
        const ev = dadosApp.eventosFinanceiros.recorrentes.find(e => e.id === eventoRecorrenteEmEdicao);
        if (ev) {
            ev.anoInicio    = parseInt(document.getElementById('anoInicioEvento').value);
            ev.anoFim       = parseInt(document.getElementById('anoFimEvento').value);
            ev.tipo         = document.getElementById('tipoEventoRecorrente').value;
            ev.periodicidade= document.getElementById('periodicidadeEvento').value;
            ev.valorPeriodo = parseFloat(document.getElementById('valorPeriodoEvento').value);
            ev.descricao    = document.getElementById('descricaoEventoRecorrente').value;
        }
    } else {
        // — NOVO —
        const novoEvento = {
            id: Date.now(),
            anoInicio: parseInt(document.getElementById('anoInicioEvento').value),
            anoFim: parseInt(document.getElementById('anoFimEvento').value),
            tipo: document.getElementById('tipoEventoRecorrente').value,
            periodicidade: document.getElementById('periodicidadeEvento').value,
            valorPeriodo: parseFloat(document.getElementById('valorPeriodoEvento').value),
            descricao: document.getElementById('descricaoEventoRecorrente').value
        };
        dadosApp.eventosFinanceiros.recorrentes.push(novoEvento);
    }

    atualizarTabelaEventosRecorrentes();
    esconderFormEventoRecorrente();
    eventoRecorrenteEmEdicao = null;
    document.getElementById('btnSalvarEventoRecorrente').textContent = 'Salvar';
}



function removerEventoRecorrente(id) {
    dadosApp.eventosFinanceiros.recorrentes = dadosApp.eventosFinanceiros.recorrentes.filter(e => e.id !== id);
    atualizarTabelaEventosRecorrentes();
}

// ------------ EVENTO RECORRENTE ------------
function editarEventoRecorrente(id) {
    const ev = dadosApp.eventosFinanceiros.recorrentes.find(e => e.id === id);
    if (!ev) return;

    document.getElementById('anoInicioEvento').value   = ev.anoInicio;
    document.getElementById('anoFimEvento').value      = ev.anoFim;
    document.getElementById('tipoEventoRecorrente').value = ev.tipo ?? 'Depósito';
    document.getElementById('periodicidadeEvento').value  = ev.periodicidade;
    document.getElementById('valorPeriodoEvento').value   = ev.valorPeriodo;
    document.getElementById('descricaoEventoRecorrente').value = ev.descricao;

    eventoRecorrenteEmEdicao = id;
    document.getElementById('btnSalvarEventoRecorrente').textContent = 'Atualizar';
    mostrarFormEventoRecorrente();
}

function atualizarTabelaEventosRecorrentes() {
    const tbody = document.querySelector('#tabelaEventosRecorrentes tbody');
    tbody.innerHTML = '';

    dadosApp.eventosFinanceiros.recorrentes.forEach(evento => {
        // fallback para dados antigos sem "tipo"
        const tipo = evento.tipo || 'Depósito';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evento.anoInicio}-${evento.anoFim}</td>
            <td>${tipo}</td>
            <td>${evento.periodicidade}</td>
            <td>€${evento.valorPeriodo.toLocaleString()}</td>
            <td>${evento.descricao}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarEventoRecorrente(${evento.id})">Editar</button>
                <button class="btn-action btn-remove" onclick="removerEventoRecorrente(${evento.id})">Remover</button>
            </td>
            `;
        tbody.appendChild(row);
    });
}

// Funções para despesas variáveis
function mostrarFormDespesa() {
    document.getElementById('formNovaDespesa').classList.remove('hidden');
}

function esconderFormDespesa() {
    document.getElementById('formNovaDespesa').classList.add('hidden');
    limparFormDespesa();
}

function limparFormDespesa() {
    document.getElementById('descricaoDespesa').value = '';
    document.getElementById('valorMensalDespesa').value = '';
    document.getElementById('anoInicioDespesa').value = '';
    document.getElementById('anoFimDespesa').value = '';
    despesaEmEdicao = null;                                 // reset
    document.getElementById('btnSalvarDespesa').textContent = 'Salvar';
}

function editarDespesa(id) {
    const desp = dadosApp.despesasVariaveis.find(d => d.id === id);
    if (!desp) return;

    // Preenche o formulário com os valores já existentes
    document.getElementById('descricaoDespesa').value    = desp.descricao;
    document.getElementById('valorMensalDespesa').value  = desp.valorMensal;
    document.getElementById('anoInicioDespesa').value    = desp.anoInicio;
    document.getElementById('anoFimDespesa').value       = desp.anoFim;

    despesaEmEdicao = id;                                   // sinaliza edição
    document.getElementById('btnSalvarDespesa').textContent = 'Atualizar';
    mostrarFormDespesa();                                   // abre modal/pop-up
}

function salvarDespesa() {
    if (despesaEmEdicao !== null) {
        // -------- ACTUALIZAR EXISTENTE --------
        const desp = dadosApp.despesasVariaveis.find(d => d.id === despesaEmEdicao);
        if (desp) {
            desp.descricao   = document.getElementById('descricaoDespesa').value;
            desp.valorMensal = parseFloat(document.getElementById('valorMensalDespesa').value);
            desp.anoInicio   = parseInt(document.getElementById('anoInicioDespesa').value);
            desp.anoFim      = parseInt(document.getElementById('anoFimDespesa').value);
        }
    } else {
        // -------- NOVA DESPESA --------
        const novaDespesa = {
            id: Date.now(),
            descricao:   document.getElementById('descricaoDespesa').value,
            valorMensal: parseFloat(document.getElementById('valorMensalDespesa').value),
            anoInicio:   parseInt(document.getElementById('anoInicioDespesa').value),
            anoFim:      parseInt(document.getElementById('anoFimDespesa').value)
        };
        dadosApp.despesasVariaveis.push(novaDespesa);
    }

    atualizarTabelaDespesasVariaveis();
    esconderFormDespesa();      // fecha & limpa
}

function removerDespesa(id) {
    dadosApp.despesasVariaveis = dadosApp.despesasVariaveis.filter(d => d.id !== id);
    atualizarTabelaDespesasVariaveis();
}

function atualizarTabelaDespesasVariaveis() {
    const tbody = document.querySelector('#tabelaDespesasVariaveis tbody');
    tbody.innerHTML = '';
    
    dadosApp.despesasVariaveis.forEach(despesa => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${despesa.descricao}</td>
            <td>€${despesa.valorMensal.toLocaleString()}</td>
            <td>${despesa.anoInicio}</td>
            <td>${despesa.anoFim}</td>
            <td>
                <button class="btn-action btn-edit"   onclick="editarDespesa(${despesa.id})">Editar</button>
                <button class="btn-action btn-remove" onclick="removerDespesa(${despesa.id})">Remover</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

const PERIODOS_POR_ANO = {
    Mensal: 12,
    Trimestral: 4,
    Semestral: 2,
    Anual: 1
};

// — Despesas Variáveis —
function fluxoVariavelAnual(ano) {
    const variaveis = dadosApp.despesasVariaveis ?? [];
    return variaveis.reduce((tot, d) => {
        const ativo = ano >= d.anoInicio && ano <= d.anoFim;
        return tot + (ativo ? -d.valorMensal * 12 : 0);   // sempre saída (−)
    }, 0);
}

// — Eventos Únicos —
function fluxoUnicoAnual(ano) {
    const unicos = (dadosApp.eventosFinanceiros?.unicos) ?? [];
    return unicos.reduce((tot, ev) => {
        if (ev.ano !== ano) return tot;          // só entra no ano certo
        const sinal = ev.tipo === 'Levantamento' ? -1 : 1;
        return tot + sinal * ev.valor;           // Depósito + | Levantamento −
    }, 0);
}


function fluxoRecorrenteAnual(ano) {
    // Percorre todos os eventos recorrentes e soma os que caem neste ano
    return dadosApp.eventosFinanceiros.recorrentes.reduce((total, ev) => {
        const dentroDoIntervalo = ano >= ev.anoInicio && ano <= ev.anoFim;
        if (!dentroDoIntervalo) return total;            // ignora se o evento não ocorre neste ano

        const vezesPorAno = PERIODOS_POR_ANO[ev.periodicidade] ?? 1;
        const sinal = ev.tipo === 'Levantamento' ? -1 : 1;  // Depósito = + , Levantamento = −

        return total + sinal * ev.valorPeriodo * vezesPorAno;
    }, 0);
}


// Função principal de cálculo
function calcularResultados() {
    // ------------- 0. Preparação -------------
    atualizarDadosBasicos();

    // Mapa fixo para converter a periodicidade em “vezes por ano”
    const PERIODOS_POR_ANO = { Mensal: 12, Trimestral: 4, Semestral: 2, Anual: 1 };

    // Helper interno: devolve a soma líquida de depósitos ( + ) e levantamentos ( − )
    // que efectivamente acontecem no ano recebido.
    function fluxoRecorrenteAnual(ano) {
        const recorrentes = (dadosApp.eventosFinanceiros?.recorrentes) ?? [];
        return recorrentes.reduce((total, ev) => {
            const dentroDoIntervalo = ano >= ev.anoInicio && ano <= ev.anoFim;
            if (!dentroDoIntervalo) return total;

            const vezes = PERIODOS_POR_ANO[ev.periodicidade] ?? 1;
            const sinal = ev.tipo === 'Levantamento' ? -1 : 1;
            return total + sinal * ev.valorPeriodo * vezes;
        }, 0);
    }

    // ------------- 1. Dados de base -------------
    const dadosBasicos   = dadosApp.dadosBasicos;
    const valorFIRE      = dadosBasicos.despesasAnuais / (dadosBasicos.taxaRetirada / 100);

    // Taxa de retorno ponderada sobre os depósitos diversificados
    let totalValor = 0;
    let somaValorada = 0;
    dadosApp.depositosDiversificados.forEach(dep => {
        totalValor   += dep.valorMensal;
        somaValorada += dep.valorMensal * dep.taxaEsperada;
    });
    const taxaRetornoNominal = totalValor > 0 ? (somaValorada / totalValor) : 7;
    const taxaRetornoReal    = taxaRetornoNominal - dadosBasicos.inflacaoAnual;

    // Contribuições e capital de partida
    const capitalInicial     = dadosBasicos.valorInvestido;
    const contribuicaoMensal = totalValor;

    // Contribuições para investimento programadas
    const contribuicaoAnual = dadosApp.depositosDiversificados
        .reduce((acc, dep) => acc + dep.valorMensal * 12, 0);

    // ---------- NOVO: saldo de rendimentos menos despesas fixas ----------
    const fluxoBasicoAnual = (dadosBasicos.rendimentoAnual || 0) -
                            (dadosBasicos.despesasAnuais  || 0) -
                            contribuicaoAnual;          // já contámos as contribuições acima
    // ---------------------------------------------------------------------

    // ------------- 2. Simulação ano-a-ano -------------
    let anosParaFIRE = 0;
    let valorAtual   = capitalInicial;

    // Usa o ano definido na app; se faltar, assume o ano civil corrente
    const anoBase = dadosApp.anoInicial || new Date().getFullYear();
    
    const ANO_MAXIMO = 120;               // segurança: ninguém vive 120 anos 😄

    while (valorAtual < valorFIRE && anosParaFIRE < ANO_MAXIMO) {
        const anoCorrente     = anoBase + anosParaFIRE;

        const fluxoRecorrente = fluxoRecorrenteAnual(anoCorrente);
        const fluxoVariavel   = fluxoVariavelAnual(anoCorrente);
        const fluxoUnico      = fluxoUnicoAnual(anoCorrente);

        valorAtual = valorAtual * (1 + taxaRetornoNominal / 100) +
                    // aportes e fluxos de caixa
                    contribuicaoAnual +
                    fluxoBasicoAnual +
                    fluxoRecorrente +
                    fluxoVariavel +
                    fluxoUnico;

        anosParaFIRE++;
    }

    const atingiuFIRE = valorAtual >= valorFIRE;
    const idadeFIRE = atingiuFIRE
        ? dadosBasicos.idadeAtual + anosParaFIRE
        : '—';                            // ou 'Não atinge'
    document.getElementById('idadeFIRE').textContent = idadeFIRE;


    // ------------- 3. Interface -------------
    document.getElementById('valorFIRE').textContent         = `€${valorFIRE.toLocaleString()}`;
    document.getElementById('idadeFIRE').textContent         = idadeFIRE;
    document.getElementById('taxaRetornoNominal').textContent= `${taxaRetornoNominal.toFixed(2)}%`;
    document.getElementById('taxaRetornoReal').textContent   = `${taxaRetornoReal.toFixed(2)}%`;

    // Actualizar gráficos ou tabelas conforme já tinhas
    atualizarGraficos();
}


function atualizarGraficos() {
    criarGraficoEvolucaoPatrimonial();
    criarGraficoDespesasVariaveis();
}

function criarGraficoEvolucaoPatrimonial() {
    const ctx = document.getElementById('chartEvolucaoPatrimonial').getContext('2d');
    
    if (chartEvolucaoPatrimonial) {
        chartEvolucaoPatrimonial.destroy();
    }
    
    // Dados simulados para evolução patrimonial
    const anos = [];
    const valoresNominais = [];
    const valoresReais = [];
    
    let valorAtual = dadosApp.dadosBasicos.valorInvestido;
    const contribuicaoAnual = dadosApp.depositosDiversificados.reduce((acc, dep) => acc + dep.valorMensal * 12, 0);
    const taxaNominal = 7; // Taxa média simplificada
    const inflacao = dadosApp.dadosBasicos.inflacaoAnual;
    
    for (let i = 0; i <= 30; i++) {
        const ano = 2025 + i;
        anos.push(ano);
        valoresNominais.push(valorAtual);
        valoresReais.push(valorAtual / Math.pow(1 + inflacao / 100, i));
        
        valorAtual = valorAtual * (1 + taxaNominal / 100) + contribuicaoAnual;
    }
    
    chartEvolucaoPatrimonial = new Chart(ctx, {
        type: 'line',
        data: {
            labels: anos,
            datasets: [{
                label: 'Valor Nominal',
                data: valoresNominais,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                tension: 0.4
            }, {
                label: 'Valor Real (ajustado inflação)',
                data: valoresReais,
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': €' + context.raw.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// CORREÇÃO PRINCIPAL: Gráfico de despesas variáveis corrigido
function criarGraficoDespesasVariaveis() {
    const ctx = document.getElementById('chartDespesasVariaveis').getContext('2d');
    
    if (chartDespesasVariaveis) {
        chartDespesasVariaveis.destroy();
    }
    
    // Calcular dados para despesas variáveis ao longo do tempo
    const anos = [];
    const datasets = [];
    const cores = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
    
    // Gerar anos de 2025 a 2055
    for (let ano = 2025; ano <= 2055; ano++) {
        anos.push(ano);
    }
    
    // Criar dataset para cada despesa variável
    dadosApp.despesasVariaveis.forEach((despesa, index) => {
        const dadosDespesa = anos.map(ano => {
            if (ano >= despesa.anoInicio && ano <= despesa.anoFim) {
                return despesa.valorMensal * 12; // Converter para anual
            }
            return 0;
        });
        
        datasets.push({
            label: despesa.descricao,
            data: dadosDespesa,
            backgroundColor: cores[index % cores.length],
            borderColor: cores[index % cores.length],
            borderWidth: 2,
            fill: false,
            tension: 0.1
        });
    });
    
    chartDespesasVariaveis = new Chart(ctx, {
        type: 'line',
        data: {
            labels: anos,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // CORREÇÃO: Desativar aspecto fixo
            aspectRatio: 2, // CORREÇÃO: Definir aspecto personalizado
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: false,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ano'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 20,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': €' + context.raw.toLocaleString() + '/ano';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// CORREÇÃO PRINCIPAL: Função de geração de PDF completamente reescrita
function gerarPDF() {
    try {
        mostrarMensagem('Gerando PDF...', 'info');
        
        // Aguardar um momento para que a biblioteca carregue
        setTimeout(() => {
            try {
                // Verificar se jsPDF está disponível
                if (typeof window.jspdf === 'undefined') {
                    throw new Error('Biblioteca jsPDF não está carregada');
                }
                
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Configurações do documento
                doc.setProperties({
                    title: 'Relatório FIRE',
                    subject: 'Independência Financeira',
                    author: 'Calculadora FIRE',
                    creator: 'Calculadora FIRE'
                });
                
                // Título principal
                doc.setFontSize(20);
                doc.setTextColor(33, 128, 141);
                doc.text('Relatorio FIRE - Independencia Financeira', 20, 25);
                
                // Data do relatório
                doc.setFontSize(10);
                doc.setTextColor(98, 108, 113);
                const dataAtual = new Date().toLocaleDateString('pt-PT');
                doc.text(`Gerado em: ${dataAtual}`, 20, 35);
                
                // Linha separadora
                doc.setDrawColor(33, 128, 141);
                doc.line(20, 40, 190, 40);
                
                // Dados básicos
                let yPos = 50;
                doc.setFontSize(14);
                doc.setTextColor(19, 52, 59);
                doc.text('Dados Basicos', 20, yPos);
                
                yPos += 10;
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                
                const dadosBasicos = dadosApp.dadosBasicos;
                doc.text(`Taxa de Retirada Segura: ${dadosBasicos.taxaRetirada}%`, 20, yPos);
                yPos += 6;
                doc.text(`Inflacao Anual: ${dadosBasicos.inflacaoAnual}%`, 20, yPos);
                yPos += 6;
                doc.text(`Idade Atual: ${dadosBasicos.idadeAtual} anos`, 20, yPos);
                yPos += 6;
                doc.text(`Rendimento Anual: €${dadosBasicos.rendimentoAnual.toLocaleString()}`, 20, yPos);
                yPos += 6;
                doc.text(`Despesas Anuais: €${dadosBasicos.despesasAnuais.toLocaleString()}`, 20, yPos);
                yPos += 6;
                doc.text(`Valor Ja Investido: €${dadosBasicos.valorInvestido.toLocaleString()}`, 20, yPos);
                
                // Resultados FIRE
                yPos += 20;
                doc.setFontSize(14);
                doc.setTextColor(19, 52, 59);
                doc.text('Resultados FIRE', 20, yPos);
                
                yPos += 10;
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                
                const valorFIRE = dadosBasicos.despesasAnuais / (dadosBasicos.taxaRetirada / 100);
                doc.text(`Valor FIRE Necessario: €${Math.round(valorFIRE).toLocaleString()}`, 20, yPos);
                yPos += 6;
                
                const taxaPonderada = document.getElementById('taxaRetornoPonderada').textContent;
                doc.text(`Taxa de Retorno Ponderada: ${taxaPonderada}`, 20, yPos);
                yPos += 6;
                
                const idadeFIRE = document.getElementById('idadeFIRE').textContent;
                doc.text(`Idade FIRE Estimada: ${idadeFIRE} anos`, 20, yPos);
                
                // Depositos Diversificados
                if (dadosApp.depositosDiversificados.length > 0) {
                    yPos += 20;
                    if (yPos > 250) {
                        doc.addPage();
                        yPos = 20;
                    }
                    
                    doc.setFontSize(14);
                    doc.setTextColor(19, 52, 59);
                    doc.text('Depositos Diversificados', 20, yPos);
                    
                    yPos += 10;
                    doc.setFontSize(8);
                    doc.setTextColor(0, 0, 0);
                    
                    dadosApp.depositosDiversificados.forEach((deposito, index) => {
                        if (yPos > 270) {
                            doc.addPage();
                            yPos = 20;
                        }
                        doc.text(`${index + 1}. ${deposito.tipo} - €${deposito.valorMensal}/mes - ${deposito.taxaEsperada}% - ${deposito.descricao}`, 20, yPos);
                        yPos += 6;
                    });
                }
                
                // Despesas Variáveis
                if (dadosApp.despesasVariaveis.length > 0) {
                    yPos += 15;
                    if (yPos > 250) {
                        doc.addPage();
                        yPos = 20;
                    }
                    
                    doc.setFontSize(14);
                    doc.setTextColor(19, 52, 59);
                    doc.text('Despesas Variaveis', 20, yPos);
                    
                    yPos += 10;
                    doc.setFontSize(8);
                    doc.setTextColor(0, 0, 0);
                    
                    dadosApp.despesasVariaveis.forEach((despesa, index) => {
                        if (yPos > 270) {
                            doc.addPage();
                            yPos = 20;
                        }
                        doc.text(`${index + 1}. ${despesa.descricao} - €${despesa.valorMensal}/mes (${despesa.anoInicio}-${despesa.anoFim})`, 20, yPos);
                        yPos += 6;
                    });
                }
                
                // Rodapé
                const totalPages = doc.internal.pages.length - 1;
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(128, 128, 128);
                    doc.text(`Pagina ${i} de ${totalPages}`, 170, 285);
                    doc.text('Calculadora FIRE - 2025', 20, 285);
                }
                
                // Salvar o PDF
                const nomeArquivo = `relatorio-fire-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}.pdf`;
                doc.save(nomeArquivo);
                
                // Mostrar mensagem de sucesso
                mostrarMensagem('PDF gerado e baixado com sucesso!', 'success');
                
            } catch (error) {
                console.error('Erro interno ao gerar PDF:', error);
                mostrarMensagem('Erro ao gerar PDF: ' + error.message, 'error');
            }
        }, 500); // Aguardar 500ms para garantir que as bibliotecas estejam carregadas
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        mostrarMensagem('Erro ao gerar PDF. Verifique se as bibliotecas estão carregadas.', 'error');
    }
}

function mostrarMensagem(texto, tipo) {
    // Remover mensagens existentes
    const mensagensExistentes = document.querySelectorAll('.status-message');
    mensagensExistentes.forEach(msg => msg.remove());
    
    // Criar nova mensagem
    const mensagem = document.createElement('div');
    mensagem.className = `status-message status-message--${tipo}`;
    mensagem.textContent = texto;
    
    // Inserir no início do main
    const main = document.querySelector('main');
    main.insertBefore(mensagem, main.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (mensagem.parentNode) {
            mensagem.remove();
        }
    }, 5000);
}