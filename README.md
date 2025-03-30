# Todo List (Django + Next.js)

## 1. Set Up Backend Django Server

```
cd server

# Create virtual env
pipenv shell

# Install dependencies
pipenv install

# Run migrations
py manage.py makemigrations
py manage.py migrate

# Create admin user
py manage.py createsuperuser

# Start Server
py manage.py runserver
```

## 2. Set up Frontend Next App

```
cd web

# Install dependencies
npm install

# Add .env file for your backend URL
NEXT_PUBLIC_DJANGO_API=

# Start app
npm run dev
```
