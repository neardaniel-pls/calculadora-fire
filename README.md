# Calculadora FIRE Portugal 🇵🇹

Uma ferramenta completa e de código aberto para planeamento da independência financeira e reforma antecipada (FIRE - Financial Independence, Retire Early), desenhada especificamente para o contexto português.

## Descrição

A Calculadora FIRE Portugal é uma aplicação web interativa que permite aos utilizadores projetar o seu caminho para a independência financeira. A ferramenta vai além das calculadoras simples, permitindo modelar cenários complexos com múltiplos tipos de investimentos, eventos de vida (únicos e recorrentes) e despesas variáveis ao longo do tempo.

A sua principal característica é a capacidade de realizar não só projeções determinísticas, mas também **simulações de Monte Carlo**, oferecendo uma visão probabilística e mais realista da robustez de um plano financeiro.

## Funcionalidades Principais

### 🔮 Simulação de Monte Carlo
- **Análise de Risco:** Execute milhares de simulações para testar a robustez do seu plano contra a volatilidade do mercado.
- **Parâmetros Configuráveis:** Defina o **Desvio Padrão (volatilidade)** para cada ativo individualmente.
- **Controlo de Simulações:** Escolha o número de simulações a executar (de 100 a 10.000) para equilibrar precisão e performance.
- **Resultados Probabilísticos:** Visualize os resultados em percentis (P10, P50, P90) e a taxa de sucesso do seu plano.
- **Histograma de Distribuição:** Analise a distribuição de resultados finais através de um gráfico de histograma interativo.

### 🎯 Dados Básicos Configuráveis
- Taxa de retirada segura personalizável (2% a 6%) com um slider intuitivo.
- Gestão de inflação para calcular o poder de compra real no futuro.
- Configuração de idade, rendimentos e despesas anuais.

### 💰 Gestão de Portfólio Detalhada
- Adicione múltiplos tipos de investimento (ETFs, PPRs, Ações, Cripto, etc.).
- Defina contribuições mensais, taxa de retorno esperada e **desvio padrão** para cada ativo.
- Especifique intervalos de tempo para cada contribuição (datas de início e fim).
- **Templates de Investimento:** Use perfis pré-definidos (Conservador, Moderado, Agressivo) ou guarde a sua própria carteira como um template personalizado.

### 📅 Eventos Financeiros e Despesas
- **Eventos Únicos:** Modele heranças, bónus, ou grandes despesas (ex: entrada de uma casa).
- **Eventos Recorrentes:** Projete rendas, bónus anuais ou outras entradas/saídas periódicas.
- **Despesas Variáveis:** Registe despesas com duração limitada, como créditos à habitação ou custos com educação.

### 📈 Visualizações e Relatórios
- **Gráficos Interativos:** Evolução do património (nominal vs. real), evolução das despesas e alocação de ativos.
- **Filtros de Período:** Analise os gráficos por diferentes períodos de tempo (1M, 6M, YTD, 1A, Tudo).
- **Exportação para PDF:** Gere um relatório completo com os seus dados, resultados e gráficos.
- **Importar/Exportar Dados:** Guarde e carregue os seus dados em formato JSON para continuar a sua análise mais tarde.

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da aplicação.
- **CSS3**: Styling moderno com variáveis, dark mode e design responsivo.
- **JavaScript (ES6+)**: Lógica de negócio modular, cálculos financeiros e manipulação do DOM.
- **Chart.js**: Gráficos interativos e visualmente apelativos.
- **jsPDF & jsPDF-AutoTable**: Geração de relatórios em PDF no lado do cliente.

## Estrutura do Projeto

```
calculadora-fire/
├── css/
│   └── style.css         # Folha de estilos principal
├── src/
│   ├── app.js            # Orquestrador principal e event listeners
│   ├── calculator.js     # Funções de cálculo (projeção e Monte Carlo)
│   ├── charts.js         # Lógica de criação e atualização dos gráficos
│   ├── pdf.js            # Lógica para gerar relatórios PDF
│   ├── state.js          # Gestão do estado da aplicação e persistência
│   └── ui.js             # Funções de manipulação da interface (UI)
├── index.html            # Página principal da aplicação
└── README.md             # Documentação do projeto
```

## Como Usar

### Instalação Local

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/NearDaniel/calculadora-fire.git
    cd calculadora-fire
    ```

2.  **Execute um servidor local (Recomendado)**:
    A forma mais fácil é usar a extensão **Live Server** no Visual Studio Code.
    - Instale a extensão.
    - Clique com o botão direito no ficheiro `index.html` e selecione "Open with Live Server".

    Alternativamente, pode usar o Python:
    ```bash
    # Se tiver Python 3 instalado
    python -m http.server
    ```
    Aceda a `http://localhost:8000` no seu browser.

### Utilização da Calculadora

1.  **Dados Básicos**: Comece por preencher os seus dados na primeira secção.
2.  **Depósitos Diversificados**: Adicione os seus investimentos mensais. Para cada um, defina a taxa de retorno esperada e o **desvio padrão** (volatilidade).
3.  **Eventos e Despesas**: Adicione quaisquer eventos financeiros ou despesas com prazo definido.
4.  **Calcular Projeção**: Clique em **"Calcular Projeção"** para ver o resultado determinístico e os gráficos principais.
5.  **Calcular Monte Carlo**:
    - Escolha o **número de simulações** desejado.
    - Clique em **"Calcular Monte Carlo"** para executar a análise de risco.
    - Analise os resultados probabilísticos e o histograma.

## Contribuições

Contribuições são muito bem-vindas! Se tiver ideias para novas funcionalidades ou melhorias, siga estes passos:

1.  Faça um fork do projeto.
2.  Crie uma branch para a sua feature (`git checkout -b feature/nova-funcionalidade`).
3.  Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4.  Faça push para a branch (`git push origin feature/nova-funcionalidade`).
5.  Abra um Pull Request.

## Licença

Este projeto é de código aberto e está disponível sob a [Licença MIT](https://opensource.org/licenses/MIT).

## Aviso Legal

Esta calculadora é uma ferramenta para fins educacionais e de planeamento. Os resultados são projeções baseadas nos dados inseridos e não constituem aconselhamento financeiro profissional. Consulte sempre um consultor financeiro certificado antes de tomar decisões de investimento importantes.

---

**Desenvolvido com ❤️ para a comunidade FIRE portuguesa.**