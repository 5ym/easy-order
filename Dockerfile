FROM alpine

RUN apk --no-cache add nginx php-fpm composer php-zip php-tokenizer php-fileinfo php-dom php-xmlwriter php-xml php-session php-pdo_mysql php-zlib php-curl npm
RUN mkdir /run/nginx
ADD default.conf /etc/nginx/conf.d/default.conf
ADD html /var/www/html
WORKDIR /var/www/html

EXPOSE 80
EXPOSE 443

CMD php-fpm7 && nginx -g "daemon off;"