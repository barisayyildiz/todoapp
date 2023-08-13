# TodoApp

```bash
cd todo_app
docker run --name learn_postgres -e POSTGRES_PASSWORD=docker_user -e POSTGRES_USER=docker_user -p 5433:5432 -v pgdata:/var/lib/postgresql/data -d postgres
cd backend
npm i
npx prisma migrate deploy # db migration
npm run start
```

Başka bir pencerede

```bash
cd todo_app
cd frontend
npm i
npm run start
```

```bash
localhost:3000 # Frontend
localhost:8000 # Backend
```
