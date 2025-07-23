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
    // Assume o evento único ocorre em Janeiro do ano especificado
    if (mes !== 0) return 0;

    return (dadosApp.eventosFinanceiros?.unicos ?? []).reduce((total, evento) => {
        if (evento.ano === ano) {
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
    const ANO_MAXIMO_SIMULACAO = 50;

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
        const fluxoRendimentos = dadosBasicos.rendimentoAnual / 12;
        const fluxoDespesasFixas = dadosBasicos.despesasAnuais / 12;
        const fluxoDespesasVariaveis = Math.abs(fluxoVariavelMensal(anoCorrente));
        const fluxoEventosRecorrentes = fluxoRecorrenteMensal(anoCorrente, mesCorrente);
        const fluxoEventosUnicos = fluxoUnicoMensal(anoCorrente, mesCorrente);

        // Aplicar juros sobre o valor do mês anterior
        const jurosMensais = valorAtual * taxaRetornoNominalMensal;

        // Calcular o fluxo de caixa líquido do mês
        const fluxoCaixaMensal = fluxoRendimentos - fluxoDespesasFixas - fluxoDespesasVariaveis + fluxoEventosRecorrentes + fluxoEventosUnicos + totalContribuicaoMensal;

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
                const despesasTotaisAno = (fluxoDespesasFixas + fluxoDespesasVariaveis) * 12;
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

    const despesasBase = dadosBasicos.despesasAnuais + Math.abs(fluxoVariavelAnual(anoBase));
    const valorFIREInicial = despesasBase / (dadosBasicos.taxaRetirada / 100);

    return {
        historicoPatrimonialAnual,
        historicoPatrimonialMensal,
        anosParaFIRE,
        idadeFIRE: atingiuFIRE ? dadosBasicos.idadeAtual + anosParaFIRE : '—',
        valorFIRE: valorFIREInicial,
        taxaRetornoNominal: taxaRetornoNominalAnual * 100,
        taxaRetornoReal: (taxaRetornoNominalAnual - dadosBasicos.inflacaoAnual / 100) * 100,
    };
}

export { simularEvolucaoPatrimonial };