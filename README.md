# Website

### Запуск
#### Local
```shell
docker compose --profile local up -d
```

#### Dev
```shell
docker compose --profile dev up -d
```

#### Prod
```shell
docker compose --profile prod up -d
```

### Подключение к контейнеру
#### Local
```shell
docker exec -it website-local sh
```

#### Dev
```shell
docker exec -it website-dev sh
```

#### Prod
```shell
docker exec -it website sh
```
