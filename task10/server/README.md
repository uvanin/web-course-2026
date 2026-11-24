# Zen-Money — Backend (лаб. 10)

Сервер на Express + SQLite (better-sqlite3).

## Установка

```bash
cd server
npm install
```

## Запуск

```bash
npm start
# или
node server.js
```

Сервер слушает `http://localhost:3001`.

База `database.sqlite` создаётся автоматически при первом запуске.
При первом старте в таблицу `categories` добавляются 3 стартовые
категории: «Еда» (expense), «Зарплата» (income), «Транспорт» (expense).

## API

| Метод | Роут | Описание |
|---|---|---|
| GET | `/categories` | Все категории |
| POST | `/categories` | Создать категорию (`name`, `type`) |
| GET | `/transactions` | Все операции; query: `category_id`, `type`, `from`, `to` |
| POST | `/transactions` | Создать операцию (`amount`, `category_id`, `date`, `comment`) |
| PUT | `/transactions/:id` | Обновить операцию (частичное обновление) |
| DELETE | `/transactions/:id` | Удалить операцию |

## Проверка через curl

### GET /categories
```bash
curl http://localhost:3001/categories
```
```
HTTP/1.1 200 OK
[{"id":1,"name":"Еда","type":"expense"},{"id":2,"name":"Зарплата","type":"income"},{"id":3,"name":"Транспорт","type":"expense"}]
```

### POST /categories
```bash
curl -X POST http://localhost:3001/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Развлечения","type":"expense"}'
```
```
HTTP/1.1 201 Created
{"id":4,"name":"Развлечения","type":"expense"}
```

### GET /transactions с фильтрами
```bash
curl "http://localhost:3001/transactions?type=expense&from=2026-01-01&to=2026-12-31"
```
```
HTTP/1.1 200 OK
[{"id":2,"amount":350,"category_id":1,"date":"2026-02-14","comment":"Обед","category_name":"Еда","category_type":"expense"}]
```

### POST /transactions
```bash
curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount":1500,"category_id":2,"date":"2026-02-01","comment":"Февральская зарплата"}'
```
```
HTTP/1.1 201 Created
{"id":1,"amount":1500,"category_id":2,"date":"2026-02-01","comment":"Февральская зарплата","category_name":"Зарплата","category_type":"income"}
```

### PUT /transactions/:id
```bash
curl -X PUT http://localhost:3001/transactions/1 \
  -H "Content-Type: application/json" \
  -d '{"amount":1700,"comment":"Зарплата + премия"}'
```
```
HTTP/1.1 200 OK
{"id":1,"amount":1700,"category_id":2,"date":"2026-02-01","comment":"Зарплата + премия","category_name":"Зарплата","category_type":"income"}
```

### DELETE /transactions/:id
```bash
curl -X DELETE http://localhost:3001/transactions/1 -i
```
```
HTTP/1.1 204 No Content
```

### DELETE несуществующей операции
```bash
curl -X DELETE http://localhost:3001/transactions/999 -i
```
```
HTTP/1.1 404 Not Found
{"error":"Операция с id=999 не найдена"}
```

### POST с невалидными данными
```bash
curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount":-5,"category_id":999,"date":"abc"}'
```
```
HTTP/1.1 400 Bad Request
{"error":"amount должен быть числом больше 0; Категория с id=999 не существует; date должен быть строкой в формате YYYY-MM-DD"}
```