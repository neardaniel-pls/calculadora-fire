import {
    dadosApp,
    estadoEdicao,
    salvarDadosNoLocalStorage,
    carregarDadosDoLocalStorage
} from './state.js';

import {
    popularDadosIniciais,
    mostrarFormDeposito,
    esconderFormDeposito,
    preencherFormularioDeposito,
    getDadosFormularioDeposito,
    atualizarTabelaDepositos,
    mostrarFormEventoUnico,
    esconderFormEventoUnico,
    preencherFormularioEventoUnico,
    getDadosFormularioEventoUnico,
    atualizarTabelaEventosUnicos,
    mostrarFormEventoRecorrente,
    esconderFormEventoRecorrente,
    preencherFormularioEventoRecorrente,
    getDadosFormularioEventoRecorrente,
    atualizarTabelaEventosRecorrentes,
    mostrarFormDespesa,
    esconderFormDespesa,
    preencherFormularioDespesa,
    getDadosFormularioDespesa,
    atualizarTabelaDespesasVariaveis
} from './ui.js';

import { simularEvolucaoPatrimonial } from './calculator.js';
import { atualizarGraficos } from './charts.js';
import { gerarPDF } from './pdf.js';

// --- Funções de Lógica de Negócio (Handlers) ---

function editarDeposito(id) {
    const dep = dadosApp.depositosDiversificados.find(d => d.id === id);
    if (!dep) return;

    preencherFormularioDeposito(dep);
    estadoEdicao.deposito = id;
    mostrarFormDeposito(true);
}

function removerDeposito(id) {
    dadosApp.depositosDiversificados = dadosApp.depositosDiversificados.filter(d => d.id !== id);
    atualizarTabelaDepositos();
    salvarDadosNoLocalStorage();
}

function editarEventoUnico(id) {
    const ev = dadosApp.eventosFinanceiros.unicos.find(e => e.id === id);
    if (!ev) return;

    preencherFormularioEventoUnico(ev);
    estadoEdicao.eventoUnico = id;
    mostrarFormEventoUnico(true);
}

function removerEventoUnico(id) {
    dadosApp.eventosFinanceiros.unicos = dadosApp.eventosFinanceiros.unicos.filter(e => e.id !== id);
    atualizarTabelaEventosUnicos();
    salvarDadosNoLocalStorage();
}

function editarEventoRecorrente(id) {
    const ev = dadosApp.eventosFinanceiros.recorrentes.find(e => e.id === id);
    if (!ev) return;

    preencherFormularioEventoRecorrente(ev);
    estadoEdicao.eventoRecorrente = id;
    mostrarFormEventoRecorrente(true);
}

function removerEventoRecorrente(id) {
    dadosApp.eventosFinanceiros.recorrentes = dadosApp.eventosFinanceiros.recorrentes.filter(e => e.id !== id);
    atualizarTabelaEventosRecorrentes();
    salvarDadosNoLocalStorage();
}

function editarDespesa(id) {
    const desp = dadosApp.despesasVariaveis.find(d => d.id === id);
    if (!desp) return;

    preencherFormularioDespesa(desp);
    estadoEdicao.despesa = id;
    mostrarFormDespesa(true);
}

function removerDespesa(id) {
    dadosApp.despesasVariaveis = dadosApp.despesasVariaveis.filter(d => d.id !== id);
    atualizarTabelaDespesasVariaveis();
    salvarDadosNoLocalStorage();
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
    salvarDadosNoLocalStorage();
}

function salvarItem(tipo) {
    const mapping = {
        deposito: {
            getDados: getDadosFormularioDeposito,
            estado: 'deposito',
            lista: dadosApp.depositosDiversificados,
            atualizar: atualizarTabelaDepositos,
            esconder: esconderFormDeposito
        },
        eventoUnico: {
            getDados: getDadosFormularioEventoUnico,
            estado: 'eventoUnico',
            lista: dadosApp.eventosFinanceiros.unicos,
            atualizar: atualizarTabelaEventosUnicos,
            esconder: esconderFormEventoUnico
        },
        eventoRecorrente: {
            getDados: getDadosFormularioEventoRecorrente,
            estado: 'eventoRecorrente',
            lista: dadosApp.eventosFinanceiros.recorrentes,
            atualizar: atualizarTabelaEventosRecorrentes,
            esconder: esconderFormEventoRecorrente
        },
        despesa: {
            getDados: getDadosFormularioDespesa,
            estado: 'despesa',
            lista: dadosApp.despesasVariaveis,
            atualizar: atualizarTabelaDespesasVariaveis,
            esconder: esconderFormDespesa
        }
    };

    const config = mapping[tipo];
    if (!config) return;

    const dadosFormulario = config.getDados();
    const idEdicao = estadoEdicao[config.estado];

    if (idEdicao) {
        const index = config.lista.findIndex(item => item.id === idEdicao);
        if (index !== -1) {
            config.lista[index] = { ...config.lista[index], ...dadosFormulario };
        }
        estadoEdicao[config.estado] = null;
    } else {
        const novoItem = { ...dadosFormulario, id: Date.now() };
        config.lista.push(novoItem);
    }

    config.atualizar();
    config.esconder();
    salvarDadosNoLocalStorage();
}

function calcularResultados() {
    atualizarDadosBasicos();
    const resultados = simularEvolucaoPatrimonial();

    // Atualizar a interface com os resultados
    document.getElementById('valorFIRE').textContent = `€${Math.round(resultados.valorFIRE).toLocaleString()}`;
    document.getElementById('idadeFIRE').textContent = resultados.idadeFIRE;
    document.getElementById('taxaRetornoNominal').textContent = `${resultados.taxaRetornoNominal.toFixed(2)}%`;
    document.getElementById('taxaRetornoReal').textContent = `${resultados.taxaRetornoReal.toFixed(2)}%`;

    atualizarGraficos(resultados);
}

function exportarDados() {
    const dadosString = JSON.stringify(dadosApp, null, 2);
    const blob = new Blob([dadosString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados-calculadora-fire.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importarDados() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const dadosImportados = JSON.parse(e.target.result);
                // Validação básica dos dados importados
                if (dadosImportados && dadosImportados.dadosBasicos) {
                    Object.assign(dadosApp, dadosImportados);
                    salvarDadosNoLocalStorage();
                    popularDadosIniciais();
                    calcularResultados();
                    alert('Dados importados com sucesso!');
                } else {
                    alert('Arquivo de dados inválido.');
                }
            } catch (error) {
                alert('Erro ao ler o arquivo de dados.');
                console.error('Erro ao importar dados:', error);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// --- Configuração de Event Listeners ---

function handleTableActions(event) {
    const target = event.target;
    if (!target.matches('.btn-action')) return;

    const action = target.dataset.action;
    const id = parseInt(target.dataset.id, 10);
    const table = target.closest('table');

    if (!action || !id || !table) return;

    switch (table.id) {
        case 'tabelaDepositos':
            if (action === 'editar') editarDeposito(id);
            else if (action === 'remover') removerDeposito(id);
            break;
        case 'tabelaEventosUnicos':
            if (action === 'editar') editarEventoUnico(id);
            else if (action === 'remover') removerEventoUnico(id);
            break;
        case 'tabelaEventosRecorrentes':
            if (action === 'editar') editarEventoRecorrente(id);
            else if (action === 'remover') removerEventoRecorrente(id);
            break;
        case 'tabelaDespesasVariaveis':
            if (action === 'editar') editarDespesa(id);
            else if (action === 'remover') removerDespesa(id);
            break;
    }
}

function configurarEventListeners() {
    const mainContainer = document.querySelector('main.container');
    
    mainContainer.addEventListener('click', handleTableActions);

    document.getElementById('formDadosBasicos').addEventListener('change', atualizarDadosBasicos);
    document.getElementById('btnCalcular').addEventListener('click', calcularResultados);
    document.getElementById('btnDownloadPDF').addEventListener('click', gerarPDF);
    document.getElementById('btnExportarDados').addEventListener('click', exportarDados);
    document.getElementById('btnImportarDados').addEventListener('click', importarDados);

    // Depósitos
    document.getElementById('btnAdicionarDeposito').addEventListener('click', mostrarFormDeposito);
    document.getElementById('btnSalvarDeposito').addEventListener('click', () => salvarItem('deposito'));
    document.getElementById('btnCancelarDeposito').addEventListener('click', esconderFormDeposito);

    // Eventos Únicos
    document.getElementById('btnAdicionarEventoUnico').addEventListener('click', mostrarFormEventoUnico);
    document.getElementById('btnSalvarEventoUnico').addEventListener('click', () => salvarItem('eventoUnico'));
    document.getElementById('btnCancelarEventoUnico').addEventListener('click', esconderFormEventoUnico);

    // Eventos Recorrentes
    document.getElementById('btnAdicionarEventoRecorrente').addEventListener('click', mostrarFormEventoRecorrente);
    document.getElementById('btnSalvarEventoRecorrente').addEventListener('click', () => salvarItem('eventoRecorrente'));
    document.getElementById('btnCancelarEventoRecorrente').addEventListener('click', esconderFormEventoRecorrente);

    // Despesas
    document.getElementById('btnAdicionarDespesa').addEventListener('click', mostrarFormDespesa);
    document.getElementById('btnSalvarDespesa').addEventListener('click', () => salvarItem('despesa'));
    document.getElementById('btnCancelarDespesa').addEventListener('click', esconderFormDespesa);
    
    // Slider
    const taxaRetiradaSlider = document.getElementById('taxaRetirada');
    taxaRetiradaSlider.addEventListener('input', (e) => {
        document.getElementById('taxaRetiradaValue').textContent = e.target.value + '%';
        dadosApp.dadosBasicos.taxaRetirada = parseFloat(e.target.value);
        salvarDadosNoLocalStorage();
    });

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', setupThemeToggle);
}
// Chart Controls
    document.getElementById('chart-granularity').addEventListener('change', calcularResultados);
    
    const periodButtons = document.querySelectorAll('.btn-group[role="toolbar"] .btn');
    periodButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');
            calcularResultados();
        });
    });

function setupThemeToggle() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-color-scheme', newTheme);
}

// --- Inicialização da Aplicação ---

function inicializarApp() {
    carregarDadosDoLocalStorage();
    configurarEventListeners();
    popularDadosIniciais();
    calcularResultados();
}

document.addEventListener('DOMContentLoaded', inicializarApp);
