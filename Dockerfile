FROM nginx:1.17.1-alpine@sha256:2bcabc23b45489fb0885d69a06ba1d648aeda973fae7bb981bafbb884165e514
COPY nginx.conf /etc/nginx/nginx.conf
COPY /dist/budget-client /usr/share/nginx/html
