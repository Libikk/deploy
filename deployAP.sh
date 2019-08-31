cd ../alertsApp

echo "Kill process App"

pm2 delete App

echo "Pulling from Master"

git pull

echo "Pulled successfully from master"

echo "Installing dependencies"

npm install

echo "Starting server..."

pm2 start npm --name "App" -i 1 -- run prod

echo "Server restarted Successfully"