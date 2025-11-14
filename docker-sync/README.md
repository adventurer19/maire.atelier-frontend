# Docker Sync - Frontend

Тази папка съдържа помощни скриптове за синхронизация на Docker команди между backend и frontend проектите.

## Как работят проектите заедно

### Backend (Laravel Sail)
- Използва `compose.yaml` (Laravel Sail)
- Създава Docker мрежа с име `sail` (която става `backend_sail` при стартиране)
- Сървиси:
  - `laravel.test` - основният Laravel контейнер (порт 80)
  - `mysql` - база данни (порт 3306)
  - `phpmyadmin` - административен интерфейс (порт 8081)

### Frontend (Next.js)
- Използва `docker-compose.yml`
- Свързва се към същата мрежа `backend_sail` (external network)
- Сървис:
  - `nextjs` - Next.js приложението (порт 3000)
  - Използва `http://laravel.test/api` за достъп до backend API

### Връзката между проектите

1. **Docker Network**: И двата проекта използват същата Docker мрежа (`backend_sail`)
2. **Service Discovery**: Frontend може да достъпи backend чрез името на сървиса `laravel.test`
3. **API URL**: Frontend е конфигуриран с `NEXT_PUBLIC_API_URL=http://laravel.test/api`

## Често използвани команди

Вижте скриптовете в тази папка за автоматизация на често използваните команди.

