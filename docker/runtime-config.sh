#!/bin/sh
set -eu

api_url=${VITE_API_URL:-}
case "$api_url" in
  *[!A-Za-z0-9:/._~-]*)
    echo "VITE_API_URL contains unsupported characters" >&2
    exit 1
    ;;
esac

api_origin=
if [ -n "$api_url" ]; then
  case "$api_url" in
    https://*|http://*) ;;
    *) echo "VITE_API_URL must use HTTP or HTTPS" >&2; exit 1 ;;
  esac
  api_scheme=${api_url%%://*}
  api_host_path=${api_url#*://}
  api_host=${api_host_path%%/*}
  api_origin="$api_scheme://$api_host"
fi

mock_api=true
if [ -n "$api_url" ]; then
  mock_api=false
fi

printf '{"apiUrl":"%s","mockApi":%s}\n' "$api_url" "$mock_api" > /usr/share/nginx/html/config.json
printf '%s\n' \
  'add_header X-Content-Type-Options "nosniff" always;' \
  'add_header Referrer-Policy "strict-origin-when-cross-origin" always;' \
  "add_header Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' ${api_origin}; object-src 'none'; base-uri 'self'; frame-ancestors 'none'\" always;" \
  > /tmp/app-security-headers.conf
