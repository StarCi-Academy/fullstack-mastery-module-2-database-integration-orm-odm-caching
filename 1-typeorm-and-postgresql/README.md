# TypeORM and PostgreSQL

Relationship demo in NestJS using TypeORM + PostgreSQL (1:1, 1:N, N:N) with Cat domain.

## 6.1 Setup

```bash
npm install
```

## 6.2 Run Services (Docker)

```bash
docker compose -f .docker/postgresql.yaml up --build -d
```

## 6.3 Run Application

```bash
npm run dev
```

## 6.4 System Flow

```text
Client -> CatController -> CatService -> Repository<Cat> -> PostgreSQL
```

Data flow:

- `POST /cats`: create a cat and related entities using cascade.
- `GET /cats`: read all cats with `passport`, `toys`, `owners`.
- `GET /cats/:id`: read one cat by id with relations.

Service interaction:

- `CatController` handles HTTP request/response.
- `CatService` executes business logic (`prepare -> execute -> confirm`).
- `Repository<Cat>` performs relational persistence via TypeORM.

## API Smoke Test

```bash
curl -s -X POST http://localhost:3000/cats \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Milo\",\"passport\":{\"passportNumber\":\"PP-001\"},\"toys\":[{\"name\":\"Ball\"}],\"owners\":[{\"name\":\"Alice\"}]}"
```

```bash
curl -s http://localhost:3000/cats
```

```bash
curl -s http://localhost:3000/cats/1
```
