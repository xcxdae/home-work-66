# Express + MongoDB Atlas 🚀

Повна система управління користувачами з використанням Express.js і MongoDB Atlas.
Проект використовує **MongoDB Node.js Driver** для прямої роботи з базою даних.

## 📋 Вимоги

- Node.js (v14.0.0 або вище)
- npm або yarn
- Аккаунт MongoDB Atlas (безкоштовно)

## 🔧 Інсталяція

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Налаштування MongoDB Atlas

1. Перейдіть на [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Реєстрація/вхід в аккаунт
3. Створіть новий проект
4. Створіть кластер (безкоштовний M0)
5. Додайте користувача з паролем
6. Додайте вашу IP адресу до Network Access
7. Отримайте Connection String (URI)

### 3. Налаштування змінних середовища

Скопіюйте файл `.env.example` у `.env` та заповніть ваші дані:

```bash
cp .env.example .env
```

Потім відредагуйте `.env` файл та додайте ваш MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
PORT=4000
NODE_ENV=development
```

**⚠️ Важливо:** Не комітьте файл `.env` у репозиторій - він містить конфіденційні дані!

**Приклад Connection String з Atlas:**

```
mongodb+srv://your_username:your_password@cluster0.xyz.mongodb.net/users?retryWrites=true&w=majority
```

**Порада:** Якщо порт 4000 зайнятий, спробуйте 3000, 8080, 4000 або будь-який інший вільний порт.

**Приклад Connection String з Atlas:**

```
mongodb+srv://your_username:your_password@cluster0.xyz.mongodb.net/users?retryWrites=true&w=majority
```

## ▶️ Запуск

### Режим розробки (з автоперезагруженням):

```bash
npm run dev
```

### Режим продакшену:

```bash
npm start
```

**❌ Якщо ви бачите помилку `EADDRINUSE`:**

Це означає, що порт зайнятий іншим процесом. Рішення:

1. **Зупиніть попередній сервер** (в терміналі, де він запущений, натисніть `Ctrl+C`)
2. **Або змініть порт** в `.env` файлі:
   ```env
   PORT=4000  # або 3000, 8080, тощо
   ```
3. **Перезапустіть сервер:**
   ```bash
   npm run dev
   ```

**На Windows** для примусового звільнення порту:

```cmd
# В командному рядку (не в Git Bash):
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F
```

**Очікуваний результат:**

```
✓ Сервер запущений на http://localhost:4000
✓ Документація API: http://localhost:4000/api/docs
✓ MongoDB підключена успішно
```

**❌ Якщо ви бачите помилку `EADDRINUSE`:**

Це означає, що порт зайнятий. Рішення:

1. **Зупиніть попередній сервер** (натисніть `Ctrl+C` у терміналі, де він запущений)
2. **Або змініть порт** в `.env` файлі:
   ```env
   PORT=3000  # або 5000, 8080, тощо
   ```
3. **Перезапустіть сервер:**
   ```bash
   npm run dev
   ```

**💡 Порада:** Завжди перевіряйте, чи не запущений вже сервер, перед запуском нового екземпляра!

Сервер запуститься на `http://localhost:4000` (або на порту, який ви вказали)

## 📚 API Endpoints

| Метод  | URL                            | Опис                                         | Приклад                                                                        |
| ------ | ------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------ |
| GET    | `/api/users`                   | Отримати всіх користувачів                   | `curl http://localhost:4000/api/users`                                         |
| GET    | `/api/users?fields=name,email` | Отримати користувачів з проекцією            | `curl "http://localhost:4000/api/users?fields=name,email,age"`                 |
| GET    | `/api/users/:id`               | Отримати користувача за ID                   | `curl http://localhost:4000/api/users/507f1f77bcf86cd799439011`                |
| POST   | `/api/users`                   | Додати нового користувача (insertOne)        | `curl -X POST http://localhost:4000/api/users`                                 |
| POST   | `/api/users/bulk`              | Додати декількох користувачів (insertMany)   | `curl -X POST http://localhost:4000/api/users/bulk`                            |
| PUT    | `/api/users/:id`               | Оновити користувача (updateOne)              | `curl -X PUT http://localhost:4000/api/users/507f1f77bcf86cd799439011`         |
| PUT    | `/api/users`                   | Оновити декількох користувачів (updateMany)  | `curl -X PUT http://localhost:4000/api/users`                                  |
| PUT    | `/api/users/:id/replace`       | Замінити користувача (replaceOne)            | `curl -X PUT http://localhost:4000/api/users/507f1f77bcf86cd799439011/replace` |
| DELETE | `/api/users/:id`               | Видалити користувача (deleteOne)             | `curl -X DELETE http://localhost:4000/api/users/507f1f77bcf86cd799439011`      |
| DELETE | `/api/users`                   | Видалити декількох користувачів (deleteMany) | `curl -X DELETE http://localhost:4000/api/users`                               |

## 📝 Приклади запитів

### Додати користувача (POST):

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Іван Петренко",
    "email": "ivan@example.com",
    "age": 25,
    "city": "Київ"
  }'
```

**Відповідь:**

```json
{
  "success": true,
  "message": "Користувач успішно створений",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Іван Петренко",
    "email": "ivan@example.com",
    "age": 25,
    "city": "Київ",
    "active": true,
    "createdAt": "2024-04-06T10:30:00.000Z",
    "updatedAt": "2024-04-06T10:30:00.000Z"
  }
}
```

### Отримати всіх користувачів (GET):

```bash
curl http://localhost:4000/api/users
```

### Отримати користувача за ID (GET):

```bash
curl http://localhost:4000/api/users/507f1f77bcf86cd799439011
```

### Оновити користувача (PUT):

```bash
curl -X PUT http://localhost:4000/api/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "age": 26,
    "city": "Львів"
  }'
```

### Видалити користувача (DELETE):

```bash
curl -X DELETE http://localhost:4000/api/users/507f1f77bcf86cd799439011
```

### Отримати користувачів з проекцією (GET з fields):

```bash
curl "http://localhost:4000/api/users?fields=name,email,age"
```

**Відповідь:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Іван Петренко",
      "email": "ivan@example.com",
      "age": 25
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Марія Іваненко",
      "email": "maria@example.com",
      "age": 30
    }
  ]
}
```

### Додати декількох користувачів (POST bulk):

```bash
curl -X POST http://localhost:4000/api/users/bulk \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Олексій Коваленко",
      "email": "oleksiy@example.com",
      "age": 28,
      "city": "Одеса"
    },
    {
      "name": "Анна Сидоренко",
      "email": "anna@example.com",
      "age": 22,
      "city": "Харків"
    }
  ]'
```

**Відповідь:**

```json
{
  "success": true,
  "message": "2 користувачів успішно створено",
  "data": {
    "insertedIds": {
      "0": "507f1f77bcf86cd799439013",
      "1": "507f1f77bcf86cd799439014"
    },
    "insertedCount": 2
  }
}
```

### Оновити декількох користувачів (PUT updateMany):

```bash
curl -X PUT http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "filter": { "city": "Київ" },
    "update": { "active": false }
  }'
```

**Відповідь:**

```json
{
  "success": true,
  "message": "3 користувачів успішно оновлено",
  "data": {
    "matchedCount": 3,
    "modifiedCount": 3
  }
}
```

### Замінити користувача (PUT replaceOne):

```bash
curl -X PUT http://localhost:4000/api/users/507f1f77bcf86cd799439011/replace \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Іван Новий",
    "email": "ivan.new@example.com",
    "age": 26,
    "city": "Львів",
    "active": true
  }'
```

**Відповідь:**

```json
{
  "success": true,
  "message": "Користувач успішно замінений",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Іван Новий",
    "email": "ivan.new@example.com",
    "age": 26,
    "city": "Львів",
    "active": true,
    "createdAt": "2024-04-06T12:00:00.000Z",
    "updatedAt": "2024-04-06T12:00:00.000Z"
  }
}
```

### Видалити декількох користувачів (DELETE deleteMany):

```bash
curl -X DELETE http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "filter": { "active": false }
  }'
```

**Відповідь:**

```json
{
  "success": true,
  "message": "5 користувачів успішно видалено",
  "data": {
    "deletedCount": 5
  }
}
```

## 📂 Структура проекту

```
├── config/
│   └── db.js                 # Підключення до MongoDB (Node.js Driver)
├── routes/
│   └── data.js              # API маршрути
├── public/
│   ├── index.html           # Головна сторінка (HTML)
│   ├── styles.css           # Стилі (CSS)
│   └── script.js            # Скрипти (JavaScript)
├── server.js                # Головний файл сервера
├── .env                     # Змінні середовища
├── package.json             # Залежності проекту
├── .gitignore               # Git конфіг
└── README.md                # Цей файл
```

## 🎯 Функціональність

- ✅ Читання даних з MongoDB (GET /api/users з підтримкою проекції)
- ✅ Додавання нових користувачів (POST /api/users - insertOne)
- ✅ Масове додавання користувачів (POST /api/users/bulk - insertMany)
- ✅ Оновлення даних користувача (PUT /api/users/:id - updateOne)
- ✅ Масове оновлення користувачів (PUT /api/users - updateMany)
- ✅ Заміна користувача (PUT /api/users/:id/replace - replaceOne)
- ✅ Видалення користувачів (DELETE /api/users/:id - deleteOne)
- ✅ Масове видалення користувачів (DELETE /api/users - deleteMany)
- ✅ Веб-інтерфейс для управління користувачами
- ✅ Валідація даних на сервері
- ✅ Обробка помилок
- ✅ CORS підтримка
- ✅ Відокремлені файли структури (HTML, CSS, JS)

## 🏗️ Використані технології

- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas + MongoDB Node.js Driver
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Utilities:** dotenv, cors, nodemon

## 🔐 Безпека

- Використовуйте сильні паролі для MongoDB
- Не комітьте `.env` файл з реальними паролями (див. `.gitignore`)
- Додайте в Network Access тільки необхідні IP адреси
- Валідуйте всі вхідні дані на сервері
- Використовуйте HTTPS в production

## 🐛 Усунення неполадок

### Помилка: "MongoDB підключена успішно" не з'являється

- Перевірте, чи MongoDB Atlas URI правильний в `.env`
- Переконайтеся, що пароль не містить спеціальних символів (або екранізуйте їх)
- Перевірте, чи вашому IP дозволено доступ до Atlas (Network Access)

### Помилка: "Cannot find module 'express'"

- Переустановіть залежності: `npm install`

### Помилка: "Port 3000 already in use"

- Змініть PORT в `.env` на вільний порт
- Або знайдіть та закройте програму, що використовує порт 3000

### Помилка при додаванні користувача: "Користувач з таким email вже існує"

- Це нормально - один email не може належати двом користувачам
- Використовуйте новий email

### Помилка: "ID користувача невалідний"

- Переконайтеся, що ви використовуєте валідний MongoDB ObjectId
- ID має містити 24 символи hex: `507f1f77bcf86cd799439011`

## 📞 Можливі розширення

- 🔐 JWT аутентифікація та авторизація
- 📄 Пагінація та лімітація результатів
- 🔍 Пошук і фільтрація користувачів
- ⚙️ Сортування результатів
- 🔄 WebSocket для real-time оновлень
- 📊 Статистика та аналітика
- 📧 Відправка email повідомлень
- 🖼️ Завантаження аватарів користувачів

## 🚀 Deployment

### Heroku

```bash
heroku create your-app-name
git push heroku main
```

### Railway.app

```bash
railway up
```

### Vercel (Frontend) + MongoDB Atlas (Backend)

Виконайте інструкції відповідного хостінгу.

## 📞 Контакти та помощь

Якщо у вас виникли питання або проблеми:

1. Перевірте [MongoDB Atlas документацію](https://www.mongodb.com/docs/atlas/)
2. Дивіться розділ "Усунення неполадок" вище
3. Перевірте логи в консолі сервера

## 📄 Ліцензія

ISC

---

Створено для навчання Node.js, Express.js і MongoDB Atlas з використанням MongoDB Node.js Driver.

**Версія:** 1.0.0  
**Останнє оновлення:** 2024-04-06
