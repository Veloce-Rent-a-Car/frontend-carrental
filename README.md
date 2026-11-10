# Veloce Rent a Car - Frontend

Frontend React + TypeScript para o sistema de locação de carros Veloce Rent a Car.

## Stack

- **React 18** + **Vite** + **TypeScript (strict)**
- **Tailwind CSS** para estilização
- **TanStack Query** para gerenciamento de estado do servidor
- **React Router** para roteamento
- **React Hook Form + Zod** para formulários e validação
- **Vitest + Testing Library** para testes de unidade

## Pré-requisitos

- Node.js 18+
- npm 9+
- Backend Spring Boot rodando em `http://localhost:8080` (veja [Backend](#backend))

## Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/Veloce-Rent-a-Car/frontend-carrental
   cd frontend-carrental
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

4. Edite `.env` se necessário (o padrão `VITE_API_URL=http://localhost:8080` funciona para desenvolvimento local).

## Como rodar

### Desenvolvimento
```bash
npm run dev
```
A aplicação abre em `http://localhost:5173`.

### Build de produção
```bash
npm run build
```
Os arquivos otimizados ficam em `dist/`.

### Preview do build
```bash
npm run preview
```

## Testes

### Rodar testes de unidade
```bash
npm test
```

### Rodar testes com cobertura
```bash
npm run test:coverage
```

### Rodar testes em modo watch
```bash
npm run test:watch
```

## Linting

```bash
npm run lint
```

## Gerar tipos TypeScript a partir do OpenAPI

O backend deve estar rodando para gerar os tipos:

```bash
npm run generate:types
```

Isso cria/atualiza `src/api/schema.d.ts` com os tipos baseados em `http://localhost:8080/v3/api-docs`.

**Importante**: Sempre regere os tipos quando o backend mudar. Não edite `schema.d.ts` manualmente.

## Estrutura do Projeto

```
src/
├── api/              # Client HTTP, tipos, funções por recurso
├── features/         # Uma pasta por área (auth, carros, alugueis, pagamentos, relatorios)
│   └── carros/
│       ├── components/
│       ├── hooks/    # useCarros, useCriarCarro (TanStack Query)
│       └── pages/
├── components/       # Componentes genéricos (Button, Input, Table, Modal, Toast)
├── lib/              # Utilitários puros (formatadores de data, moeda, validação Zod)
├── routes/           # Definição de rotas e guarda de rota autenticada
├── test/             # Configuração de testes
└── main.tsx          # Entry point
```

## Funcionalidades

1. **Autenticação**: Login e registro com JWT guardado em memória
2. **Carros**: Listagem, criação, edição, exclusão, importação/exportação CSV
3. **Aluguéis**: Criação (escolher cliente e carro) e listagem
4. **Pagamentos**: Registro de pagamento e atualização de status do aluguel
5. **Relatórios**: Por cliente e por carro

## Backend

A API Spring Boot deve:
- Rodar em `http://localhost:8080`
- Liberar CORS para `http://localhost:5173` (origem do Vite)
- Expor OpenAPI em `/v3/api-docs`

### Configuração de CORS necessária no backend

No `SecurityConfig.java` (ou equivalente), adicione:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(request -> {
            var config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("http://localhost:5173"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("*"));
            config.setAllowCredentials(true);
            return config;
        }))
        // ... resto da configuração
}
```

Ou via `WebMvcConfigurer`:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL base da API Spring Boot | `http://localhost:8080` |

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |
| `npm test` | Roda testes de unidade |
| `npm run test:coverage` | Testes com cobertura |
| `npm run test:watch` | Testes em modo watch |
| `npm run lint` | Linting com ESLint |
| `npm run generate:types` | Gera tipos do OpenAPI |

## Licença

MIT
