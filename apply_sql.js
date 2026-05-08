const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function applySql() {
    // Read .env.local for POSTGRES_URL
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const pgUrl = envFile.match(/POSTGRES_URL="(.+?)"/)?.[1];

    if (!pgUrl) {
        console.error('❌ Error: POSTGRES_URL not found in .env.local');
        process.exit(1);
    }

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'SUPABASE_PRODUCTION_SETUP.sql');
    if (!fs.existsSync(sqlPath)) {
        console.error('❌ Error: SUPABASE_PRODUCTION_SETUP.sql not found');
        process.exit(1);
    }
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Clean up pgUrl if it has sslmode
    const cleanUrl = pgUrl.split('?')[0];

    console.log('🚀 Connecting to Supabase...');
    const client = new Client({
        connectionString: cleanUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('✅ Connected. Applying Production SQL...');
        
        // Execute the SQL
        await client.query(sql);
        
        console.log('🎉 SUCCESS: All tables, policies, and triggers applied to Supabase.');
    } catch (err) {
        console.error('❌ Database Error:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

applySql();
