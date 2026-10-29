# Pokédex API — Checkpoint 6 (DDD Java)

API Restful de cadastro de Pokémons feita com **Spring Boot 4.1.1**, **Java 21**, **Maven** e **Oracle**, seguindo a arquitetura em camadas vista em aula (projeto MegaFarma):

```
resource (PokemonResource)  →  bo (PokemonBO)  →  dao (PokemonDAO + ConnectionFactory)  →  Oracle
                         to (PokemonTO) trafega os dados entre as camadas
```

**Aluno:** Josué Menezes — RM 569220

## 🔗 Deploy

- **API (Render):** https://pokedex-api-pepl.onrender.com/pokedex
- **Front-End (React, Vercel):** https://pokedex-front-569220.vercel.app

## Endpoints

| Verbo | Rota | Método | Sucesso | Falha |
|---|---|---|---|---|
| GET | `/pokedex` | `findAll()` | 200 OK | 404 Not Found |
| GET | `/pokedex/{codigo}` | `findByCodigo()` | 200 OK | 404 Not Found |
| POST | `/pokedex` | `save()` | 201 Created | 400 Bad Request |
| PUT | `/pokedex/{codigo}` | `update()` | 201 Created | 400 Bad Request |
| DELETE | `/pokedex/{codigo}` | `delete()` | 204 No Content | 404 Not Found |

### JSON de exemplo (POST / PUT)

```json
{
  "nome": "Squirtle",
  "tipo": "Água",
  "nivel": 15,
  "peso": 9.0,
  "dataDaCaptura": "2025-08-02"
}
```

## Conceitos aplicados

- **API Restful** com `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PathVariable` e `@RequestBody`
- Respostas com **`ResponseEntity`** e os **status codes** corretos (200, 201, 204, 400, 404)
- **TO** (Transfer Object), **DAO** (persistência com JDBC/`PreparedStatement`) e **BO** (regras de negócio)
- **ConnectionFactory** com os padrões **Factory** e **Singleton**, lendo as credenciais de **variáveis de ambiente** (`DB_URL`, `DB_USER`, `DB_PASSWORD`)
- **CorsFilter** (pacote `resource`) liberando o **CORS** para o Front-End em outro domínio consumir a API
- **Bean Validation** (`@NotBlank`, `@NotNull`, `@Size`, `@Min`, `@Max`, `@Positive`, `@PastOrPresent`) ativado com **`@Valid`**, com mensagens por campo
- **Regra de negócio** no BO: a data da captura não pode ser no futuro
- Testes das requisições pelo **Insomnia** (coleção em `insomnia/insomnia-pokedex.json`)
- **Build** (`.jar`) e **Deploy** no Render com **Dockerfile**
- **Front-End em React** (pasta `frontend/`) consumindo todos os endpoints

## Rodando localmente

1. Rode o `script.sql` no Oracle SQL Developer para criar a tabela `DDD_POKEMONS`.
2. No IntelliJ, em **Run → Edit Configurations → Environment variables**, defina:
   `DB_USER=seu_rm;DB_PASSWORD=sua_senha`
3. Rode a classe `PokedexApplication` e acesse `http://localhost:8080/pokedex`.

## Front-End

```bash
cd frontend
npm install
npm run dev
```

Por padrão ele usa a API do Render. Para usar a API local, crie `frontend/.env.local` com `VITE_API_URL=http://localhost:8080`.

## Deploy (Render)

O projeto tem `Dockerfile`. No Render: **New → Web Service → repositório do GitHub → Runtime: Docker** e, em **Environment**, crie `DB_USER` e `DB_PASSWORD`.
