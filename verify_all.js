const { Client } = require('pg');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const pgUrl = envFile.match(/POSTGRES_URL="(.+?)"/)?.[1];

if (!pgUrl) {
    console.error('POSTGRES_URL not found');
    process.exit(1);
}

const client = new Client({
    connectionString: pgUrl,
    ssl: { rejectUnauthorized: false }
});

client.connect()
    .then(() => client.query('SELECT id, title, flag FROM public.challenges'))
    .then((res) => {
        console.table(res.rows);
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
