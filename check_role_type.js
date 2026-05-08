const { Client } = require('pg');
const fs = require('fs');

async function checkType() {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const pgUrl = envFile.match(/POSTGRES_URL="(.+?)"/)?.[1].split('?')[0];
    
    const client = new Client({
        connectionString: pgUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role'");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err.message);
    } finally {
        await client.end();
    }
}

checkType();
