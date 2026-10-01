# 🚀 Production-Ready NestJS Backend Architecture

A scalable, high-performance RESTful API built with **NestJS**, leveraging **Clean Architecture** patterns, **MongoDB Atlas**, and **Upstash Redis** for caching. Designed and configured for seamless deployment on cloud environments like **Vercel**.

---

## 🌟 Key Features

* **Modular Architecture**: Strictly follows NestJS modularity and Clean Architecture principles to ensure high maintainability, decoupling, and scalability.
* **Database Management**: Integrated with **MongoDB Atlas** using **Mongoose ORM** for efficient schema design and data modeling.
* **Centralized Caching**: Hybrid Redis implementation using `node-redis` with custom TTL strategies for multi-tier caching (User Profiles, Sessions, Temporary Data).
* **Robust Error Handling**: Global exception filters and standard response structures.
* **Environment Configuration**: Centralized environment validation using NestJS `@nestjs/config`.
* **Serverless Deployment Ready**: Fully configured with `vercel.json` and optimized entry handler for serverless functions.

---

## 🛠️ Tech Stack & Tools

* **Framework**: [NestJS](https://nestjs.com/) (Node.js)
* **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) + Mongoose
* **Cache**: [Upstash Redis](https://upstash.com/) (`node-redis` driver)
* **Deployment**: [Vercel](https://vercel.com/)
* **Language**: TypeScript

---

## 🏛️ Project Architecture

```text
src/
├── cache/               # Centralized Redis caching module & strategies
│   ├── cache.enums.ts   # Caching strategies and TTL keys
│   ├── redis-cache.module.ts
│   └── redis-cache.service.ts
├── users/               # Example User Domain (Controller, Service, Schema)
│   ├── dto/
│   ├── schemas/
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── app.module.ts        # Root Application Module
└── main.ts              # Application Bootstrap & Serverless Entry Point

```

---

## ⚙️ Environment Variables

* Create a .env file in the root directory and configure the following variables:

``` env
NODE_ENV=development
PORT=3000

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/your_db_name?retryWrites=true&w=majority

# Upstash Redis TLS Connection String
REDIS_URL=rediss://default:YOUR_UPSTASH_TOKEN@your-host.upstash.io:6379

```

---

## 🚀 Getting Started

### 1. Installation

``` bash

npm install

```

### 2. Development Mode (Hot-Reload)


``` bash

npm run start:dev

``` 

### 3. Build for Production

``` bash

npm run build

``` 

### 4. Run Production Build Locally

``` bash

npm run start:prod

``` 




---
## ☁️ Deployment (Vercel)

1. : Ensure vercel.json is configured in the root directory.

2. : Push your codebase to a GitHub repository.

3. : Import the project into Vercel.

4. : Set the Environment Variables (MONGO_URI, REDIS_URL) in the Vercel Dashboard (Settings -> Environment Variables).

5. : Deploy!


---


## 👨‍💻 Author

**Ahmed Mohamed**

* Full-Stack Web Developer & Software Engineer

* GitHub: [Ahmed Mohamed](https://github.com/AhmdMohamed506k)

* LinkedIn: [Ahmed Mohamed](https://www.linkedin.com/messaging/thread/new/)


  