FROM alpine

RUN apk --no-cache add nginx php-fpm composer php-zip php-tokenizer php-fileinfo php-dom php-xmlwriter php-xml php-session php-pdo_mysql php-zlib php-curl npm
RUN mkdir /run/nginx
RUN apk add certbot && pip3 install certbot-dns-cloudflare
RUN echo "dns_cloudflare_email = 16yuim@gmail.com" > cred.ini
RUN echo "dns_cloudflare_api_key = 4067c5dc056266d4d97f8fb8dac7d7f42e6a8" >> cred.ini
RUN chmod 600 cred.ini
RUN certbot certonly --dns-cloudflare --dns-cloudflare-credentials cred.ini --email 16yuim@gmail.com --agree-tos -n -d siteyui.site -d *.siteyui.site -d daco.dev -d *.daco.dev
ADD default.conf /etc/nginx/conf.d/default.conf
ADD html /var/www/html
WORKDIR /var/www/html

EXPOSE 80
EXPOSE 443

CMD php-fpm7 && nginx -g "daemon off;"