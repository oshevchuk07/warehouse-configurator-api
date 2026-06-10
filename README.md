npm i -D prisma
yarn add @prisma/client
npx prisma init --datasource-provider sqlite

npx prisma db push        # якщо хочеш просто створити таблиці з моделей

npx prisma migrate dev --name init
npx prisma generate
npx prisma studio