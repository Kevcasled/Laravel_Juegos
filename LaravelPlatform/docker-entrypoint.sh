#!/bin/sh
set -e

echo "Running migrations and seeders..."
php artisan migrate --force --seed

echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear

echo "Starting Laravel on 0.0.0.0:8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
