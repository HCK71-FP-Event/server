module.exports = {
  apps: [
    {
      name: "m-event",
      script: "./bin/www",
      env: {
        NODE_ENV: "production",
        PORT: 80,
        JWT_SECRET: "ayam123",
        MIDTRANS_SERVER_KEY:"SB-Mid-server-FHY9yP5924-6a69eM5AT0rHB",
	DATABASE_URL:"postgresql://postgres.hdcagwgebqgqlpvdsbwz:96wtlvPiMzeoDRKF@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
      },
    },
  ],
};

