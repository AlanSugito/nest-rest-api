## Tech Stack

- NestJs
- PostgreSQL
- PrismaORM

### Run Project

```
npm install

npx prisma migrate dev

npm run start
```

### API Docs

Dokumentasi bisa diakses setelah menjalankan program pada endpoint:
http://localhost:{PORT}/api/docs

### Pattern (Modular)

NestJS didesain berbasis modular untuk menjaga arsitektur yang terorganisir dan scalable.
Dengan membagi aplikasi menjadi module seperti AuthModule, BookModule, dan ReviewModule, setiap domain memiliki dependensi dan tanggung jawab sendiri.
Ini memudahkan testing, pengembangan fitur baru, serta isolasi bug.
