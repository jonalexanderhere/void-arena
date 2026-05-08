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

async function testRpc() {
    try {
        await client.connect();
        
        const challengeId = '23b76de3-cfa6-4841-83b0-c11f61fe65ff';
        const submittedFlag = 'VOID{LOL_TES_AJA_KALI}';
        
        const res = await client.query('SELECT flag, points FROM public.challenges WHERE id = $1', [challengeId]);
        const dbFlag = res.rows[0].flag;
        
        console.log('Testing Comparison:');
        console.log('Submitted: [' + submittedFlag + ']');
        console.log('Database:  [' + dbFlag + ']');
        console.log('Match:     ', submittedFlag.trim() === dbFlag.trim());
        
        if (submittedFlag.trim() !== dbFlag.trim()) {
            console.log('Mismatch details:');
            console.log('Length S:', submittedFlag.trim().length);
            console.log('Length D:', dbFlag.trim().length);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

testRpc();
