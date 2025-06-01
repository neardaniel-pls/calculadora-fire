# Calculadora FIRE Portugal 🇵🇹

Uma ferramenta completa e gratuita para planeamento da independência financeira e reforma antecipada (FIRE - Financial Independence, Retire Early) adaptada ao contexto português.

## Descrição

A Calculadora FIRE Portugal é uma aplicação web desenvolvida especificamente para investidores portugueses que procuram atingir a independência financeira. A ferramenta incorpora as particularidades fiscais de Portugal, incluindo PPR, ETF e outros veículos de investimento disponíveis no mercado nacional.

## Funcionalidades Principais

### 🎯 Dados Básicos Configuráveis
- Taxa de retirada segura personalizável (2% a 6%)
- Gestão avançada de inflação com valores reais e nominais
- Configuração de idade, rendimentos e despesas atuais

### 💰 Sistema de Investimentos com Intervalos Temporais
- Gestão de múltiplos tipos de investimento (ETF, PPR, Ações, etc.)
- Definição de períodos específicos para cada investimento
- Cálculo automático da taxa de retorno ponderada
- Adição e remoção dinâmica de investimentos

### 📅 Eventos Financeiros Completos
- **Eventos Únicos**: Heranças, vendas, despesas extraordinárias
- **Eventos Recorrentes**: Depósitos e levantamentos regulares
- Edição inline de eventos existentes
- Modelação de cenários complexos

### 📊 Despesas Variáveis Temporais
- Gestão de despesas com início e fim específicos
- Ideal para créditos habitacionais, educação, etc.
- Impacto automático nas projeções FIRE

### 📈 Visualizações e Análises
- Gráfico de evolução patrimonial (nominal vs real)
- Análise de sensibilidade da taxa de retirada
- Gráfico de despesas variáveis ao longo do tempo
- Export completo para PDF

## Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Styling moderno com variáveis CSS e dark mode
- **JavaScript (ES6+)**: Lógica de negócio e cálculos financeiros
- **Chart.js**: Gráficos interativos e responsivos
- **jsPDF**: Geração de relatórios em PDF

## Estrutura do Projeto

```
calculadora-fire/
├── index.html          # Página principal da aplicação
├── app.js             # Lógica JavaScript principal
├── style.css          # Estilos CSS completos
└── README.md          # Documentação do projeto
```

## Como Usar

### Instalação Local

1. **Clone ou descarregue os ficheiros**:
   ```bash
   git clone [url-do-repositorio] TODO: Criar REPO
   cd calculadora-fire
   ```

2. **Opção 1 - Abertura Direta**:
   - Abra o ficheiro `index.html` diretamente no browser

3. **Opção 2 - Servidor Local (Recomendado)**:
   ```bash
   # Com Python 3
   python -m http.server 8000
   
   # Aceda a http://localhost:8000
   ```

4. **Opção 3 - Live Server (VS Code)**:
   - Instale a extensão Live Server
   - Clique direito em `index.html` → "Open with Live Server"

### Utilização da Calculadora

1. **Configure os Dados Básicos**:
   - Defina a taxa de retirada desejada (padrão 4%)
   - Insira idade atual, rendimentos e despesas anuais
   - Configure a taxa de inflação esperada

2. **Adicione Investimentos**:
   - Clique em "Adicionar Investimento"
   - Defina tipo, valor mensal, taxa esperada
   - Configure datas de início e fim (opcional)

3. **Configure Eventos Financeiros**:
   - Adicione eventos únicos (heranças, despesas extraordinárias)
   - Configure eventos recorrentes (bónus anuais, rendas)
   - Use levantamentos (-) e depósitos (+)

4. **Defina Despesas Variáveis**:
   - Adicione despesas temporárias (crédito habitacional, educação)
   - Configure períodos específicos para cada despesa

5. **Calcule e Analise**:
   - Clique em "Calcular FIRE"
   - Analise os resultados e gráficos
   - Exporte o relatório em PDF

## Exemplos de Uso

### Cenário Típico Português
```javascript
// Dados de exemplo incluídos na aplicação
Idade Atual: 30 anos
Rendimento Anual: €36.000
Despesas Anuais: €24.000
Valor Já Investido: €50.000

Investimentos:
- ETF Global: €500/mês a 7% (2025-2055)
- PPR: €450/mês a 3% (2025-2055)

Despesas Variáveis:
- Crédito Habitação: €700/mês (2025-2050)
- Creche: €350/mês (2026-2031)
```

## Características Únicas

### Adaptado ao Mercado Português
- Considera vantagens fiscais dos PPR
- Inclui reduções tributárias para investimentos de longo prazo
- Modelação realista de custos habitacionais e educacionais

### Interface Intuitiva
- Design responsivo para desktop e mobile
- Dark mode automático
- Validações em tempo real
- Feedback visual durante cálculos

### Cálculos Avançados
- Valor presente líquido de eventos financeiros
- Ajuste automático à inflação
- Taxa de retorno ponderada por tempo
- Análise de sensibilidade completa

## Fórmulas Principais

### Valor FIRE Necessário
```
Valor FIRE = (Despesas Anuais Ajustadas) / (Taxa de Retirada)
```

### Taxa de Retorno Ponderada
```
Taxa Ponderada = Σ(Valor Mensal × Taxa × Meses Ativo) / Σ(Valor Mensal × Meses Ativo)
```

### Ajuste de Inflação
```
Valor Real = Valor Nominal / (1 + Inflação)^Anos
```

## Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Faça fork do projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit as suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## Suporte

Para questões, sugestões ou reportar bugs, por favor abra uma issue no repositório.

## Aviso Legal

Esta calculadora é uma ferramenta educacional e de planeamento. Os resultados são projeções baseadas nos dados inseridos e não constituem aconselhamento financeiro profissional. Consulte sempre um consultor financeiro certificado antes de tomar decisões de investimento importantes.

---

**Desenvolvido com ❤️ para a comunidade FIRE portuguesa**