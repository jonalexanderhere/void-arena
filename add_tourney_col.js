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

const sql = `ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL;`;

client.connect()
    .then(() => client.query(sql))
    .then(() => {
        console.log('✅ tournament_id column added to challenges');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error updating database:', err.message);
        process.exit(1);
    });
