## Setup

## Prisma

```bash
yarn add -D prisma
```

```bash
npx prisma init
```

```bash
yarn add @prisma/client
```

```bash
npx prisma migrate dev --name init
```

## Graphql

```bash
yarn add @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

## Validation

```bash
yarn add -D class-validator class-transformer
```

## Encryption and Hashing

```bash
yarn add @nestjs/config bcrypt
```

```bash
yarn add -D @types/bcrypt
```

## Authentication

```bash
yarn add @nestjs/jwt
```

## Cookie

```bash
yarn add cookie-parser
```

```bash
yarn add -D @types/cookie-parser
```

## Modules

```bash
nest g module auth
```

```bash
nest g service auth
```

```bash
nest g module user
```

```bash
nest g service user
```

```bash
nest g resolver user
```

# Utils

```bash
yarn add apollo-server-express
```

# GrphQl upload

```bash
yarn add graphql-upload@^14.0.0 graphql-upload-ts@^2.0.6

```

```bash
yarn add multer
```

- generate Post

```bash
nest g module post
```

```bash
nest g service post
```

```bash
nest g resolver post
```

- generate Like

```bash
nest g module like
```

```bash
nest g service like
```

```bash
nest g resolver like
```

# Static file server

```bash
yarn add @nestjs/serve-static
```

-- add to app.moodule.ts

```ts
ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'public'), // This points to the 'public' folder where your static files are located
  serveRoot: '/', // This means files will be available under 'http://localhost:5000/files/'
  exclude: ['/graphql'],
}),
```

# Comment modules

```bash
nest g module comment
```

```bash
nest g service comment
```

```bash
nest g resolver comment
```
