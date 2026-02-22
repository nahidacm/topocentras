### Installation

```bash
docker compose build
```

```bash
docker compose up -d
```

```bash
docker exec -it <php-container-name> bash
```

#### Composer timeout

```bash
composer config -g process-timeout 2000
```

#### Setup repo.magento.com access keys

Magento repo access key: https://commercemarketplace.adobe.com/customer/accessKeys/

```bash
composer config --global http-basic.repo.magento.com <PUBLIC_KEY> <PRIVATE_KEY>
```

#### Setup github token to avaoid rate limits

```bash
composer config --global github-oauth.github.com <GITHUB_TOKEN>
```

#### Create Magento project

```bash
composer create-project \
--repository-url=https://repo.magento.com/ \
magento/project-community-edition .
```

#### Install dependencies

```bash
php bin/magento setup:install \
--base-url=http://localhost:8080 \
--db-host=db \
--db-name=magento \
--db-user=magento \
--db-password=magento \
--admin-firstname=Admin \
--admin-lastname=User \
--admin-email=madmin@mailinator.com \
--admin-user=admin \
--admin-password=Admin123! \
--language=en_US \
--currency=USD \
--timezone=Asia/Dhaka \
--search-engine=opensearch \
--opensearch-host=opensearch \
--opensearch-port=9200
```

#### Change permissions

```bash
chmod -R 777 /var/www/html/var
chmod -R 777 /var/www/html/pub/media
```

#### DB backup and restore

https://experienceleague.adobe.com/en/docs/commerce-operations/installation-guide/tutorials/backup

```

```
