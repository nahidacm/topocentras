### Installation

Ref: https://experienceleague.adobe.com/en/docs/commerce-operations/installation-guide/composer

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

Run inside php container

```bash
composer create-project \
--repository-url=https://repo.magento.com/ \
magento/project-community-edition .
```

#### Install dependencies

Run inside php container

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
--currency=EUR \
--timezone=Asia/Dhaka \
--search-engine=opensearch \
--opensearch-host=opensearch \
--opensearch-port=9200
```

#### Copy config files

Run from host

```bash
cp magento-nginx.conf src/
cp magento.gitignore src/.gitignore
```

#### Change permissions

Run inside php container

```bash
chmod -R 777 /var/www/html/var
chmod -R 777 /var/www/html/pub
```

#### Generate codes

Run inside php container

```bash
# rm -rf generated/* var/cache/* var/page_cache/*
# composer install
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento cache:clean
bin/magento cache:flush
bin/magento setup:static-content:deploy -f
```

#### Disable 2FA

Run inside php container

```bash
bin/magento admin:adobe-ims:disable
bin/magento module:disable Magento_AdminAdobeImsTwoFactorAuth
bin/magento module:disable Magento_TwoFactorAuth
bin/magento setup:di:compile
bin/magento cache:flush
```

### Admin Settings

- Set the default currency to "EUR".
- Enable single store mode.
- Set Stock Management to "No".
- Create a customer group named "Topo Klubas".
- Lcale to Lithunia
- Set "Topocentras" theme

#### DB backup and restore

Run inside php container

```bash
bin/magento config:set system/backup/functionality_enabled 1
bin/magento setup:backup --db
```

https://experienceleague.adobe.com/en/docs/commerce-operations/installation-guide/tutorials/backup

#### Cheat sheet

```bash
bin/magento info:adminurl
```
