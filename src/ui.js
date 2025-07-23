import { dadosApp, estadoEdicao, salvarDadosNoLocalStorage } from './state.js';

// Funções de UI para Depósitos
function mostrarFormDeposito(isEditing = false) {
    document.getElementById('formNovoDeposito').classList.remove('hidden');
    document.getElementById('btnSalvarDeposito').textContent = isEditing ? 'Atualizar' : 'Salvar';
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
    estadoEdicao.deposito = null;
    document.getElementById('btnSalvarDeposito').textContent = 'Salvar';
}


function preencherFormularioDeposito(deposito) {
    document.getElementById('tipoInvestimento').value = deposito.tipo;
    document.getElementById('valorMensal').value = deposito.valorMensal;
    document.getElementById('taxaEsperada').value = deposito.taxaEsperada;
    document.getElementById('dataInicio').value = deposito.dataInicio;
    document.getElementById('dataFim').value = deposito.dataFim;
    document.getElementById('descricaoInvestimento').value = deposito.descricao;
}

function getDadosFormularioDeposito() {
    return {
        tipo: document.getElementById('tipoInvestimento').value,
        valorMensal: parseFloat(document.getElementById('valorMensal').value) || 0,
        taxaEsperada: parseFloat(document.getElementById('taxaEsperada').value) || 0,
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        descricao: document.getElementById('descricaoInvestimento').value
    };
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
                <button class="btn-action btn-edit" data-action="editar" data-id="${deposito.id}">Editar</button>
                <button class="btn-action btn-remove" data-action="remover" data-id="${deposito.id}">Remover</button>
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


// Funções de UI para Eventos Únicos
function mostrarFormEventoUnico(isEditing = false) {
    document.getElementById('formNovoEventoUnico').classList.remove('hidden');
    document.getElementById('btnSalvarEventoUnico').textContent = isEditing ? 'Atualizar' : 'Salvar';
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
    estadoEdicao.eventoUnico = null;
    document.getElementById('btnSalvarEventoUnico').textContent = 'Salvar';
}


function preencherFormularioEventoUnico(evento) {
    document.getElementById('anoEvento').value = evento.ano;
    document.getElementById('tipoEvento').value = evento.tipo;
    document.getElementById('valorEvento').value = evento.valor;
    document.getElementById('descricaoEvento').value = evento.descricao;
}

function getDadosFormularioEventoUnico() {
    return {
        ano: parseInt(document.getElementById('anoEvento').value) || new Date().getFullYear(),
        tipo: document.getElementById('tipoEvento').value,
        valor: parseFloat(document.getElementById('valorEvento').value) || 0,
        descricao: document.getElementById('descricaoEvento').value
    };
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
                <button class="btn-action btn-edit" data-action="editar" data-id="${evento.id}">Editar</button>
                <button class="btn-action btn-remove" data-action="remover" data-id="${evento.id}">Remover</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Funções de UI para Eventos Recorrentes
function mostrarFormEventoRecorrente(isEditing = false) {
    document.getElementById('formNovoEventoRecorrente').classList.remove('hidden');
    document.getElementById('btnSalvarEventoRecorrente').textContent = isEditing ? 'Atualizar' : 'Salvar';
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
    estadoEdicao.eventoRecorrente = null;
    document.getElementById('btnSalvarEventoRecorrente').textContent = 'Salvar';
}


function preencherFormularioEventoRecorrente(evento) {
    document.getElementById('anoInicioEvento').value = evento.anoInicio;
    document.getElementById('anoFimEvento').value = evento.anoFim;
    document.getElementById('tipoEventoRecorrente').value = evento.tipo ?? 'Depósito';
    document.getElementById('periodicidadeEvento').value = evento.periodicidade;
    document.getElementById('valorPeriodoEvento').value = evento.valorPeriodo;
    document.getElementById('descricaoEventoRecorrente').value = evento.descricao;
}

function getDadosFormularioEventoRecorrente() {
    return {
        anoInicio: parseInt(document.getElementById('anoInicioEvento').value) || new Date().getFullYear(),
        anoFim: parseInt(document.getElementById('anoFimEvento').value) || new Date().getFullYear(),
        tipo: document.getElementById('tipoEventoRecorrente').value,
        periodicidade: document.getElementById('periodicidadeEvento').value,
        valorPeriodo: parseFloat(document.getElementById('valorPeriodoEvento').value) || 0,
        descricao: document.getElementById('descricaoEventoRecorrente').value
    };
}

function atualizarTabelaEventosRecorrentes() {
    const tbody = document.querySelector('#tabelaEventosRecorrentes tbody');
    tbody.innerHTML = '';

    dadosApp.eventosFinanceiros.recorrentes.forEach(evento => {
        const tipo = evento.tipo || 'Depósito';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evento.anoInicio}-${evento.anoFim}</td>
            <td>${tipo}</td>
            <td>${evento.periodicidade}</td>
            <td>€${evento.valorPeriodo.toLocaleString()}</td>
            <td>${evento.descricao}</td>
            <td>
                <button class="btn-action btn-edit" data-action="editar" data-id="${evento.id}">Editar</button>
                <button class="btn-action btn-remove" data-action="remover" data-id="${evento.id}">Remover</button>
            </td>
            `;
        tbody.appendChild(row);
    });
}

// Funções de UI para Despesas Variáveis
function mostrarFormDespesa(isEditing = false) {
    document.getElementById('formNovaDespesa').classList.remove('hidden');
    document.getElementById('btnSalvarDespesa').textContent = isEditing ? 'Atualizar' : 'Salvar';
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
    estadoEdicao.despesa = null;
    document.getElementById('btnSalvarDespesa').textContent = 'Salvar';
}


function preencherFormularioDespesa(despesa) {
    document.getElementById('descricaoDespesa').value = despesa.descricao;
    document.getElementById('valorMensalDespesa').value = despesa.valorMensal;
    document.getElementById('anoInicioDespesa').value = despesa.anoInicio;
    document.getElementById('anoFimDespesa').value = despesa.anoFim;
}

function getDadosFormularioDespesa() {
    return {
        descricao: document.getElementById('descricaoDespesa').value,
        valorMensal: parseFloat(document.getElementById('valorMensalDespesa').value) || 0,
        anoInicio: parseInt(document.getElementById('anoInicioDespesa').value) || new Date().getFullYear(),
        anoFim: parseInt(document.getElementById('anoFimDespesa').value) || new Date().getFullYear()
    };
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
                <button class="btn-action btn-edit" data-action="editar" data-id="${despesa.id}">Editar</button>
                <button class="btn-action btn-remove" data-action="remover" data-id="${despesa.id}">Remover</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Funções de UI Gerais
function popularDadosIniciais() {
    const dadosBasicos = dadosApp.dadosBasicos;
    document.getElementById('taxaRetirada').value = dadosBasicos.taxaRetirada;
    document.getElementById('taxaRetiradaValue').textContent = dadosBasicos.taxaRetirada + '%';
    document.getElementById('inflacaoAnual').value = dadosBasicos.inflacaoAnual;
    document.getElementById('idadeAtual').value = dadosBasicos.idadeAtual;
    document.getElementById('rendimentoAnual').value = dadosBasicos.rendimentoAnual;
    document.getElementById('despesasAnuais').value = dadosBasicos.despesasAnuais;
    document.getElementById('valorInvestido').value = dadosBasicos.valorInvestido;
    
    atualizarTabelaDepositos();
    atualizarTabelaEventosUnicos();
    atualizarTabelaEventosRecorrentes();
    atualizarTabelaDespesasVariaveis();
}

function mostrarMensagem(texto, tipo) {
    const mensagensExistentes = document.querySelectorAll('.status-message');
    mensagensExistentes.forEach(msg => msg.remove());
    
    const mensagem = document.createElement('div');
    mensagem.className = `status-message status-message--${tipo}`;
    mensagem.textContent = texto;
    
    const main = document.querySelector('main');
    main.insertBefore(mensagem, main.firstChild);
    
    setTimeout(() => {
        if (mensagem.parentNode) {
            mensagem.remove();
        }
    }, 5000);
}

export {
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
    atualizarTabelaDespesasVariaveis,
    mostrarMensagem
};