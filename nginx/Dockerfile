FROM nginx:latest
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./liberlife.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html
EXPOSE 80
