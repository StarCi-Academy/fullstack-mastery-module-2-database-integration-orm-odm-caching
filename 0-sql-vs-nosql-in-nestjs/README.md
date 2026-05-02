# SQL vs NoSQL in NestJS

Compare one domain flow across two storage models:

- PostgreSQL via TypeORM
- MongoDB via Mongoose

## 6.1 Setup

```bash
npm install
```

## 6.2 Run Services (Docker)

```bash
docker compose -f .docker/postgresql.yaml up --build -d
docker compose -f .docker/mongodb.yaml up --build -d
```

## 6.3 Run Application

```bash
npm run dev
```

## 6.4 System Flow

Main processing flow:

```text
Client -> CompareController -> CompareService -> (TypeORM Repository + Mongoose Model) -> (PostgreSQL + MongoDB)
```

Data flow:

- `POST /compare/write`: writes the same payload to both SQL and NoSQL.
- `GET /compare/read`: returns `sqlCount`, `noSqlCount`, `sqlItems`, and `noSqlItems` for side-by-side comparison.

Service interaction:

- `CompareController` handles HTTP layer.
- `CompareService` orchestrates write/read logic.
- `Repository<SqlComparisonItemEntity>` handles PostgreSQL persistence.
- `Model<NoSqlComparisonItemDocument>` handles MongoDB persistence.

## API Smoke Test

```bash
curl -s -X POST http://localhost:3000/compare/write \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Order #1\",\"amount\":100}"
```

```bash
curl -s http://localhost:3000/compare/read
```

