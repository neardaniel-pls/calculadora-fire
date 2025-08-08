import { dadosApp } from './state.js';
import { simularEvolucaoPatrimonial, simularMonteCarlo } from './calculator.js';
import { mostrarMensagem } from './ui.js';

function gerarPDF() {
    try {
        mostrarMensagem('Gerando PDF...', 'info');
        const resultados = simularEvolucaoPatrimonial(); // Usar dados frescos
        const mcResults = simularMonteCarlo(1000); // Usar 1000 simulações para o PDF

        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            throw new Error('Biblioteca jsPDF não está carregada.');
        }
        const doc = new jsPDF();

        let yPos = 0;

        // --- Função auxiliar para adicionar o cabeçalho ---
        const addHeader = () => {
            doc.setFontSize(20);
            doc.setTextColor(33, 128, 141);
            doc.text('Relatório de Análise FIRE', 20, 25);
            doc.setFontSize(10);
            doc.setTextColor(98, 108, 113);
            doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-PT')}`, 20, 35);
            doc.setDrawColor(33, 128, 141);
            doc.line(20, 40, 190, 40);
            yPos = 50;
        };

        // --- Função auxiliar para adicionar o rodapé ---
        const addFooter = () => {
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text(`Página ${i} de ${pageCount}`, 175, 285);
                doc.text('Calculadora FIRE © 2025', 20, 285);
            }
        };
        
        // --- Função auxiliar para adicionar uma nova página se necessário ---
        const checkPageBreak = (neededHeight) => {
            if (yPos + neededHeight > 280) {
                doc.addPage();
                addHeader();
            }
        };

        // --- Início do Documento ---
        addHeader();

        // --- Dados Base ---
        checkPageBreak(40);
        doc.setFontSize(14);
        doc.setTextColor(19, 52, 59);
        doc.text('Dados de Base', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const { dadosBasicos } = dadosApp;
        doc.text(`Idade Atual: ${dadosBasicos.idadeAtual} anos`, 20, yPos);
        doc.text(`Valor Investido Inicial: €${dadosBasicos.valorInvestido.toLocaleString()}`, 100, yPos);
        yPos += 7;
        doc.text(`Rendimento Anual: €${dadosBasicos.rendimentoAnual.toLocaleString()}`, 20, yPos);
        doc.text(`Despesas Anuais Fixas: €${dadosBasicos.despesasAnuais.toLocaleString()}`, 100, yPos);
        yPos += 7;
        doc.text(`Taxa de Retirada Segura: ${dadosBasicos.taxaRetirada}%`, 20, yPos);
        doc.text(`Inflação Anual Esperada: ${dadosBasicos.inflacaoAnual}%`, 100, yPos);
        yPos += 15;

        // --- Resultados da Simulação ---
        checkPageBreak(40);
        doc.setFontSize(14);
        doc.setTextColor(19, 52, 59);
        doc.text('Resultados da Simulação Determinística', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Valor FIRE Necessário (base): €${Math.round(resultados.valorFIRE).toLocaleString()}`, 20, yPos);
        yPos += 7;
        doc.text(`Idade FIRE Estimada: ${resultados.idadeFIRE} anos`, 20, yPos);
        yPos += 7;
        doc.text(`Taxa de Retorno Nominal Ponderada: ${resultados.taxaRetornoNominal.toFixed(2)}%`, 20, yPos);
        doc.text(`Taxa de Retorno Real (descontada a inflação): ${resultados.taxaRetornoReal.toFixed(2)}%`, 100, yPos);
        yPos += 15;

        // --- Gráfico de Evolução Patrimonial ---
        checkPageBreak(100);
        doc.setFontSize(14);
        doc.setTextColor(19, 52, 59);
        doc.text('Gráfico de Evolução Patrimonial', 20, yPos);
        yPos += 10;
        const canvas = document.getElementById('chartEvolucaoPatrimonial');
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 20, yPos, 170, 80);
        yPos += 90;

        // --- Tabelas de Dados ---
        const addTable = (title, headers, data) => {
            checkPageBreak(40 + data.length * 10); // Estimativa de altura
            doc.setFontSize(14);
            doc.setTextColor(19, 52, 59);
            doc.text(title, 20, yPos);
            yPos += 10;
            doc.autoTable({
                startY: yPos,
                head: [headers],
                body: data,
                theme: 'striped',
                headStyles: { fillColor: [33, 128, 141] },
            });
            yPos = doc.autoTable.previous.finalY + 15;
        };

        addTable('Depósitos Diversificados',
            ['Tipo', 'Valor Mensal', 'Taxa Esperada', 'Descrição'],
            dadosApp.depositosDiversificados.map(d => [d.tipo, `€${d.valorMensal}`, `${d.taxaEsperada}%`, d.descricao])
        );

        addTable('Despesas Variáveis',
            ['Descrição', 'Valor Mensal', 'Início', 'Fim'],
            dadosApp.despesasVariaveis.map(d => [d.descricao, `€${d.valorMensal}`, d.anoInicio, d.anoFim])
        );

        // --- Gráfico de Alocação de Ativos ---
        checkPageBreak(100);
        doc.setFontSize(14);
        doc.setTextColor(19, 52, 59);
        doc.text('Gráfico de Alocação de Ativos', 20, yPos);
        yPos += 10;
        const assetCanvas = document.getElementById('chartAssetAllocation');
        const assetImgData = assetCanvas.toDataURL('image/png');
        doc.addImage(assetImgData, 'PNG', 20, yPos, 80, 80);
        yPos += 90;

        // --- Gráfico de Evolução das Despesas ---
        checkPageBreak(100);
        doc.setFontSize(14);
        doc.setTextColor(19, 52, 59);
        doc.text('Gráfico de Evolução das Despesas', 20, yPos);
        yPos += 10;
        const despesasCanvas = document.getElementById('chartDespesasVariaveis');
        const despesasImgData = despesasCanvas.toDataURL('image/png');
        doc.addImage(despesasImgData, 'PNG', 20, yPos, 170, 80);
        yPos += 90;

        // --- Resultados da Simulação de Monte Carlo ---
        checkPageBreak(40);
        doc.setFontSize(14);
        doc.setTextColor(19, 52, 59);
        doc.text('Resultados da Simulação de Monte Carlo', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Património Mediano (P50): €${Math.round(mcResults.p50).toLocaleString()}`, 20, yPos);
        doc.text(`Taxa de Sucesso: ${mcResults.taxaDeSucesso.toFixed(1)}%`, 100, yPos);
        yPos += 7;
        doc.text(`Património Pessimista (P10): €${Math.round(mcResults.p10).toLocaleString()}`, 20, yPos);
        doc.text(`Património Otimista (P90): €${Math.round(mcResults.p90).toLocaleString()}`, 100, yPos);
        yPos += 15;

        // --- Gráfico de Distribuição de Monte Carlo ---
        checkPageBreak(100);
        doc.setFontSize(14);
        doc.setTextColor(19, 52, 59);
        doc.text('Gráfico de Distribuição de Monte Carlo', 20, yPos);
        yPos += 10;
        const mcCanvas = document.getElementById('chartMonteCarloDistribution');
        const mcImgData = mcCanvas.toDataURL('image/png');
        doc.addImage(mcImgData, 'PNG', 20, yPos, 170, 80);
        yPos += 90;

        // --- Finalizar e Salvar ---
        addFooter();
        const nomeArquivo = `Relatorio_FIRE_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(nomeArquivo);
        mostrarMensagem('PDF gerado e baixado com sucesso!', 'success');

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        mostrarMensagem(`Erro ao gerar PDF: ${error.message}`, 'error');
    }
}

export { gerarPDF };