// ------------------------------ STATE MANAGEMENT ------------------------------

// Estado inicial da aplicação
const initialState = {
    dadosBasicos: {
        taxaRetirada: 4,
        inflacaoAnual: 2,
        idadeAtual: 29,
        idadeReforma: 65,
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
            desvioPadrao: 18,
            dataInicio: "2025-01-01",
            dataFim: "2055-01-01",
            descricao: "FTSE ALL-World"
        },
        {
            id: 2,
            tipo: "PPR",
            valorMensal: 150,
            taxaEsperada: 4,
            desvioPadrao: 8,
            dataInicio: "2025-01-01",
            dataFim: "2055-01-01",
            descricao: "Stoik PPR"
        },
        {
            id: 3,
            tipo: "Cripto",
            valorMensal: 200,
            taxaEsperada: 14,
            desvioPadrao: 40,
            dataInicio: "2025-01-01",
            dataFim: "2055-01-01",
            descricao: "Bitcoin"
        }
    ],
    eventosFinanceiros: {
        unicos: [
            {
                id: 1,
                ano: 2035,
                mes: 6, // Junho
                tipo: "Depósito",
                valor: 5000,
                descricao: "Herança"
            },
            {
                id: 2,
                ano: 2035,
                mes: 7, // Julho
                tipo: "Levantamento",
                valor: 6000,
                descricao: "Viagem Japão"
            }
        ],
        recorrentes: [
            {
                id: 1,
                anoInicio: 2025,
                anoFim: 2050,
                periodicidade: "Anual",
                valorPeriodo: 50,
                descricao: "Bônus",
                tipo: "Renda Extra"
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

// O estado principal da aplicação
let dadosApp = JSON.parse(JSON.stringify(initialState));

// Variáveis de estado para edição
let estadoEdicao = {
    deposito: null,
    despesa: null,
    eventoUnico: null,
    eventoRecorrente: null
};

// ------------------------------ PERSISTÊNCIA DE DADOS ------------------------------

function salvarDadosNoLocalStorage() {
    try {
        localStorage.setItem('dadosCalculadoraFIRE', JSON.stringify(dadosApp));
    } catch (e) {
        console.error("Erro ao salvar dados no LocalStorage:", e);
        // Futuramente, podemos usar um módulo de UI para mostrar esta mensagem
    }
}

function carregarDadosDoLocalStorage() {
    try {
        const dadosSalvos = localStorage.getItem('dadosCalculadoraFIRE');
        if (dadosSalvos) {
            let dadosParse = JSON.parse(dadosSalvos);
            
            // Garantir a migração de dados para novas estruturas
            if (dadosParse.eventosFinanceiros && dadosParse.eventosFinanceiros.unicos) {
                dadosParse.eventosFinanceiros.unicos.forEach(e => {
                    if (!e.mes) e.mes = 1; // Adiciona o mês padrão se não existir
                });
            }
            if (dadosParse.depositosDiversificados) {
                dadosParse.depositosDiversificados.forEach(d => {
                    if (!d.desvioPadrao) d.desvioPadrao = 5; // Adiciona desvio padrão padrão
                });
            }

            // Fundir dados para garantir que novas propriedades sejam adicionadas
            // caso o modelo de dados mude no futuro.
            dadosApp = { ...initialState, ...dadosParse };
        }
    } catch (e) {
        console.error("Erro ao carregar dados do LocalStorage:", e);
        // Futuramente, podemos usar um módulo de UI para mostrar esta mensagem
    }
}

// Exporta as funções e o estado para serem usados em outros módulos
export {
    dadosApp,
    estadoEdicao,
    salvarDadosNoLocalStorage,
    carregarDadosDoLocalStorage
};