import { dadosApp } from './state.js';

const PERIODOS_POR_ANO = {
    Mensal: 12,
    Trimestral: 4,
    Semestral: 2,
    Anual: 1
};

// — Despesas Variáveis —
function fluxoVariavelAnual(ano) {
    return (dadosApp.despesasVariaveis ?? []).reduce((total, despesa) => {
        if (ano >= despesa.anoInicio && ano <= despesa.anoFim) {
            return total - (despesa.valorMensal * 12); // Saída é negativa
        }
        return total;
    }, 0);
}

// — Eventos Únicos —
function fluxoUnicoAnual(ano) {
    return (dadosApp.eventosFinanceiros?.unicos ?? []).reduce((total, evento) => {
        if (evento.ano === ano) {
            const valor = evento.tipo === 'Levantamento' ? -evento.valor : evento.valor;
            return total + valor;
        }
        return total;
    }, 0);
}

// — Eventos Recorrentes —
function fluxoRecorrenteAnual(ano) {
    return (dadosApp.eventosFinanceiros?.recorrentes ?? []).reduce((total, evento) => {
        if (ano >= evento.anoInicio && ano <= evento.anoFim) {
            const vezesPorAno = PERIODOS_POR_ANO[evento.periodicidade] || 1;
            const valor = evento.tipo === 'Levantamento' ? -evento.valorPeriodo : evento.valorPeriodo;
            return total + (valor * vezesPorAno);
        }
        return total;
    }, 0);
}

// --- Funções de cálculo mensal (para granularidade) ---

function fluxoVariavelMensal(ano) {
    return (dadosApp.despesasVariaveis ?? []).reduce((total, despesa) => {
        if (ano >= despesa.anoInicio && ano <= despesa.anoFim) {
            return total - despesa.valorMensal; // Saída é negativa
        }
        return total;
    }, 0);
}

function fluxoUnicoMensal(ano, mes) { // mes is 0-11
    return (dadosApp.eventosFinanceiros?.unicos ?? []).reduce((total, evento) => {
        // O mês do evento (1-12) deve corresponder ao mês da simulação (0-11)
        if (evento.ano === ano && (evento.mes - 1) === mes) {
            const valor = evento.tipo === 'Levantamento' ? -evento.valor : evento.valor;
            return total + valor;
        }
        return total;
    }, 0);
}

function fluxoRecorrenteMensal(ano, mes) { // mes is 0-11
    return (dadosApp.eventosFinanceiros?.recorrentes ?? []).reduce((total, evento) => {
        if (ano >= evento.anoInicio && ano <= evento.anoFim) {
            const valor = evento.tipo === 'Levantamento' ? -evento.valorPeriodo : evento.valorPeriodo;
            switch (evento.periodicidade) {
                case 'Mensal':
                    return total + valor;
                case 'Trimestral':
                    if (mes % 3 === 0) return total + valor;
                    break;
                case 'Semestral':
                    if (mes % 6 === 0) return total + valor;
                    break;
                case 'Anual':
                    if (mes === 0) return total + valor;
                    break;
            }
        }
        return total;
    }, 0);
}
/**
 * Realiza a simulação ano a ano da evolução do património.
 * @returns {object} Um objeto com os resultados da simulação.
 */
function simularEvolucaoPatrimonial() {
    const { dadosBasicos, depositosDiversificados } = dadosApp;
    const anoBase = new Date().getFullYear();
    const anosDeSimulacao = dadosBasicos.idadeReforma - dadosBasicos.idadeAtual;
    const ANO_MAXIMO_SIMULACAO = Math.max(anosDeSimulacao, 1); // Garante pelo menos 1 ano de simulação

    // 1. Calcular taxas e contribuições
    let totalContribuicaoMensal = 0;
    let somaPonderada = 0;
    depositosDiversificados.forEach(dep => {
        totalContribuicaoMensal += dep.valorMensal;
        somaPonderada += dep.valorMensal * (dep.taxaEsperada / 100);
    });
    const taxaRetornoNominalAnual = totalContribuicaoMensal > 0 ? somaPonderada / totalContribuicaoMensal : 0.07;
    const taxaRetornoNominalMensal = Math.pow(1 + taxaRetornoNominalAnual, 1 / 12) - 1;
    const taxaInflacaoMensal = Math.pow(1 + dadosBasicos.inflacaoAnual / 100, 1 / 12) - 1;

    // 2. Preparar dados para a simulação
    let valorAtual = dadosBasicos.valorInvestido;
    const historicoPatrimonialMensal = [{
        ano: anoBase,
        mes: 0, // Janeiro
        valorNominal: valorAtual,
        valorReal: valorAtual
    }];
    const historicoPatrimonialAnual = [{
        ano: anoBase,
        valorNominal: valorAtual,
        valorReal: valorAtual
    }];

    let anosParaFIRE = 0;
    let atingiuFIRE = false;

    // 3. Simulação mês a mês
    for (let i = 1; i <= ANO_MAXIMO_SIMULACAO * 12; i++) {
        const anoCorrente = anoBase + Math.floor((i - 1) / 12);
        const mesCorrente = (i - 1) % 12;

        // Calcular fluxos de caixa para o mês corrente
        const fluxoEventosRecorrentes = fluxoRecorrenteMensal(anoCorrente, mesCorrente);
        const fluxoEventosUnicos = fluxoUnicoMensal(anoCorrente, mesCorrente);

        // Aplicar juros sobre o valor do mês anterior
        const jurosMensais = valorAtual * taxaRetornoNominalMensal;

        // O fluxo de caixa a ser adicionado ao património são as contribuições explícitas e os eventos
        const fluxoCaixaMensal = totalContribuicaoMensal + fluxoEventosRecorrentes + fluxoEventosUnicos;

        // Atualizar o valor do património
        valorAtual += jurosMensais + fluxoCaixaMensal;

        // Armazenar histórico mensal
        const inflacaoAcumulada = Math.pow(1 + taxaInflacaoMensal, i);
        historicoPatrimonialMensal.push({
            ano: anoCorrente,
            mes: mesCorrente,
            valorNominal: valorAtual,
            valorReal: valorAtual / inflacaoAcumulada
        });

        // Se for o último mês do ano, armazena o histórico anual
        if (mesCorrente === 11) {
            historicoPatrimonialAnual.push({
                ano: anoCorrente + 1,
                valorNominal: valorAtual,
                valorReal: valorAtual / inflacaoAcumulada
            });

            // Verificar FIRE anualmente
            if (!atingiuFIRE) {
                const despesasAnuaisFixas = dadosBasicos.despesasAnuais;
                const despesasAnuaisVariaveis = Math.abs(fluxoVariavelAnual(anoCorrente));
                const despesasTotaisAno = despesasAnuaisFixas + despesasAnuaisVariaveis;
                const alvoFIRE = despesasTotaisAno / (dadosBasicos.taxaRetirada / 100);

                if (valorAtual >= alvoFIRE) {
                    atingiuFIRE = true;
                    anosParaFIRE = (anoCorrente + 1) - anoBase;
                }
            }
        }
    }

    if (!atingiuFIRE) {
        anosParaFIRE = 'N/A';
    }

    // Calcula as despesas no ano em que o FIRE é atingido para um alvo mais preciso
    const anoFIRE = atingiuFIRE ? anoBase + anosParaFIRE : anoBase + ANO_MAXIMO_SIMULACAO;
    const despesasNoAnoFIRE = dadosBasicos.despesasAnuais + Math.abs(fluxoVariavelAnual(anoFIRE));
    const valorFIRECorreto = despesasNoAnoFIRE / (dadosBasicos.taxaRetirada / 100);

    return {
        historicoPatrimonialAnual,
        historicoPatrimonialMensal,
        anosParaFIRE,
        idadeFIRE: atingiuFIRE ? dadosBasicos.idadeAtual + anosParaFIRE : '—',
        valorFIRE: valorFIRECorreto,
        taxaRetornoNominal: taxaRetornoNominalAnual * 100,
        taxaRetornoReal: (taxaRetornoNominalAnual - dadosBasicos.inflacaoAnual / 100) * 100,
    };
}

/**
 * Gera um número aleatório seguindo uma distribuição normal (Box-Muller).
 * @param {number} media - A média da distribuição.
 * @param {number} desvioPadrao - O desvio padrão da distribuição.
 * @returns {number} Um número aleatório.
 */
function gerarNumeroNormal(media, desvioPadrao) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converte (0,1) em (0,1]
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * desvioPadrao + media;
}

/**
 * Executa uma única simulação de Monte Carlo.
 * @param {object} dados - Os dados da aplicação.
 * @returns {number} O valor final do património para esta simulação.
 */
function executarSimulacaoUnica(dados) {
    const { dadosBasicos, depositosDiversificados } = dados;
    const anoBase = new Date().getFullYear();
    const anosDeSimulacao = dadosBasicos.idadeReforma - dadosBasicos.idadeAtual;
    const ANO_MAXIMO_SIMULACAO = Math.max(anosDeSimulacao, 1);

    let valorAtual = dadosBasicos.valorInvestido;
    let taxaRetornoNominalAnualPonderada = 0;

    const totalContribuicaoMensalDepositos = depositosDiversificados.reduce((sum, dep) => sum + dep.valorMensal, 0);

    for (let i = 1; i <= ANO_MAXIMO_SIMULACAO * 12; i++) {
        const anoCorrente = anoBase + Math.floor((i - 1) / 12);
        const mesCorrente = (i - 1) % 12;

        if (mesCorrente === 0) {
            let somaPonderada = 0;
            depositosDiversificados.forEach(dep => {
                const desvioPadrao = (dep.desvioPadrao || 5) / 100;
                const retornoAnualSimulado = gerarNumeroNormal(dep.taxaEsperada / 100, desvioPadrao);
                somaPonderada += dep.valorMensal * retornoAnualSimulado;
            });
            taxaRetornoNominalAnualPonderada = totalContribuicaoMensalDepositos > 0 ? somaPonderada / totalContribuicaoMensalDepositos : 0;
        }
        
        const taxaRetornoNominalMensal = Math.pow(1 + taxaRetornoNominalAnualPonderada, 1 / 12) - 1;

        const fluxoEventosRecorrentes = fluxoRecorrenteMensal(anoCorrente, mesCorrente);
        const fluxoEventosUnicos = fluxoUnicoMensal(anoCorrente, mesCorrente);

        const jurosMensais = valorAtual * taxaRetornoNominalMensal;
        const fluxoCaixaMensal = totalContribuicaoMensalDepositos + fluxoEventosRecorrentes + fluxoEventosUnicos;

        valorAtual += jurosMensais + fluxoCaixaMensal;
    }

    return valorAtual;
}


/**
 * Realiza a simulação de Monte Carlo.
 * @param {number} numSimulacoes - O número de simulações a serem executadas.
 * @returns {object} Um objeto com os resultados da simulação de Monte Carlo.
 */
function simularMonteCarlo(numSimulacoes = 2500) {
    const resultadosFinais = [];
    for (let i = 0; i < numSimulacoes; i++) {
        resultadosFinais.push(executarSimulacaoUnica(dadosApp));
    }

    resultadosFinais.sort((a, b) => a - b);

    const p10 = resultadosFinais[Math.floor(numSimulacoes * 0.10)];
    const p50 = resultadosFinais[Math.floor(numSimulacoes * 0.50)];
    const p90 = resultadosFinais[Math.floor(numSimulacoes * 0.90)];

    const despesasFinais = (dadosApp.dadosBasicos.despesasAnuais + Math.abs(fluxoVariavelAnual(dadosApp.dadosBasicos.idadeReforma - dadosApp.dadosBasicos.idadeAtual + new Date().getFullYear()))) / (dadosApp.dadosBasicos.taxaRetirada / 100);
    
    const sucessoSimulacoes = resultadosFinais.filter(r => r >= despesasFinais).length;
    const taxaDeSucesso = (sucessoSimulacoes / numSimulacoes) * 100;

    return {
        p10,
        p50,
        p90,
        taxaDeSucesso,
        resultados: resultadosFinais
    };
}


function simularSequenceOfReturnsRisk(srrDuration, srrReturn) {
    const { dadosBasicos, depositosDiversificados } = dadosApp;
    const anoBase = new Date().getFullYear();
    const anosDeSimulacao = dadosBasicos.idadeReforma - dadosBasicos.idadeAtual;
    const ANO_MAXIMO_SIMULACAO = Math.max(anosDeSimulacao, 1);

    let totalContribuicaoMensal = 0;
    let somaPonderada = 0;
    depositosDiversificados.forEach(dep => {
        totalContribuicaoMensal += dep.valorMensal;
        somaPonderada += dep.valorMensal * (dep.taxaEsperada / 100);
    });
    const taxaRetornoNominalAnual = totalContribuicaoMensal > 0 ? somaPonderada / totalContribuicaoMensal : 0.07;
    const taxaRetornoStressAnual = srrReturn / 100;

    let valorAtual = dadosBasicos.valorInvestido;
    const historicoPatrimonialAnual = [{
        ano: anoBase,
        valorNominal: valorAtual,
    }];

    for (let i = 0; i < ANO_MAXIMO_SIMULACAO; i++) {
        const anoCorrente = anoBase + i;
        
        // A taxa de stress aplica-se nos primeiros 'srrDuration' anos.
        const taxaDeRetornoDoAno = i < srrDuration ? taxaRetornoStressAnual : taxaRetornoNominalAnual;
        
        const jurosAnuais = valorAtual * taxaDeRetornoDoAno;
        
        const contribuicaoAnual = totalContribuicaoMensal * 12;
        const fluxoEventosRecorrentes = fluxoRecorrenteAnual(anoCorrente);
        const fluxoEventosUnicos = fluxoUnicoAnual(anoCorrente);
        const fluxoDespesasVariaveis = fluxoVariavelAnual(anoCorrente);

        const fluxoCaixaAnual = contribuicaoAnual + fluxoEventosRecorrentes + fluxoEventosUnicos + fluxoDespesasVariaveis;

        valorAtual += jurosAnuais + fluxoCaixaAnual;

        historicoPatrimonialAnual.push({
            ano: anoCorrente,
            valorNominal: valorAtual,
        });
    }

    return { historicoPatrimonialAnual };
}
export { simularEvolucaoPatrimonial, simularMonteCarlo, simularSequenceOfReturnsRisk };