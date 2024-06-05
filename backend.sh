#!/bin/bash
sleep 5
# Start ngrok for port 5000
ngrok http 5000 > /dev/null 2>&1 &

# Wait for ngrok to start and get the public URL
sleep 5
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^/"]*')

# Set the public URL as an environment variable
export API_BASE_URL=$PUBLIC_URL
echo Backend URL: $PUBLIC_URL

backend/venv/bin/python3 backend/app.py