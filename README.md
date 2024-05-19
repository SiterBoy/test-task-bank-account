# test-task-bank-account

1. Сделать базу данных
2. Накатить миграции npm run migration:run
3. Сделать очередь balance_queue в rabbitmq
4. Сделать файд .env и заполнить его на основании .env.example
5. Запустить приложение npm run start:dev
6. Запустить нагрузочное тестирование  artillery run load-test.yaml

Эндпоинты  
http://localhost:{PORT}/gateway/balance/increase
http://localhost:{PORT}/gateway/balance/decrease

