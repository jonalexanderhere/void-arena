const { Client } = require('pg');
const fs = require('fs');
const crypto = require('crypto');

async function setupAdmin() {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const pgUrl = envFile.match(/POSTGRES_URL="(.+?)"/)?.[1].split('?')[0];

    const client = new Client({
        connectionString: pgUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected to Supabase.');

        // 1. Run the production SQL setup first
        const sqlContent = fs.readFileSync('SUPABASE_PRODUCTION_SETUP.sql', 'utf8');
        await client.query(sqlContent);
        console.log('✅ Production SQL Schema applied.');

        // 2. Create the Admin User in auth.users if not exists
        const adminEmail = 'admin@void.arena';
        const adminPass = 'VoidAdmin123!';
        const adminId = crypto.randomUUID();

        // Check if user already exists
        const checkUser = await client.query('SELECT id FROM auth.users WHERE email = $1', [adminEmail]);
        
        if (checkUser.rows.length === 0) {
            console.log(`🚀 Creating new admin account: ${adminEmail}...`);
            
            // Note: We use pgcrypto for hashing if available, or just insert a known hash.
            // Supabase uses bcrypt.
            await client.query(`
                INSERT INTO auth.users (
                    instance_id, id, aud, role, email, encrypted_password, 
                    email_confirmed_at, last_sign_in_at, raw_app_meta_data, 
                    raw_user_meta_data, is_super_admin, created_at, updated_at,
                    phone, phone_confirmed_at, phone_change, phone_change_token,
                    email_change_token_new, email_change, confirmation_token
                ) VALUES (
                    '00000000-0000-0000-0000-000000000000', $1, 'authenticated', 'authenticated', $2, 
                    crypt($3, gen_salt('bf')), 
                    now(), now(), '{"provider":"email","providers":["email"]}', 
                    '{"username":"VOID_SYSTEM_ADMIN", "full_name":"Void System Administrator"}', 
                    false, now(), now(),
                    null, null, '', '', '', '', ''
                )
            `, [adminId, adminEmail, adminPass]);

            // The trigger handle_new_user() in SUPABASE_PRODUCTION_SETUP.sql 
            // should automatically create the public.profiles entry.
            // But we'll force the role to admin just in case.
            
            try {
                await client.query('UPDATE public.profiles SET role = $1 WHERE id = $2', ['admin', adminId]);
            } catch (updateErr) {
                // Fallback for custom user_role type
                await client.query('UPDATE public.profiles SET role = $1::text::user_role WHERE id = $2', ['admin', adminId]);
            }
            
            console.log('🎉 ADMIN ACCOUNT CREATED SUCCESSFULLY!');
            console.log('------------------------------------------');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPass}`);
            console.log('------------------------------------------');
        } else {
            const existingId = checkUser.rows[0].id;
            await client.query('UPDATE public.profiles SET role = $1 WHERE id = $2', ['admin', existingId]);
            console.log(`ℹ️ User ${adminEmail} already exists. Promoted to ADMIN.`);
        }

    } catch (err) {
        if (err.message.includes('crypt')) {
            console.error('❌ Error: pgcrypto extension might be missing or not in search path.');
            console.log('Try running: CREATE EXTENSION IF NOT EXISTS pgcrypto; in Supabase SQL editor.');
        } else {
            console.error('❌ Error:', err.message);
        }
    } finally {
        await client.end();
    }
}

setupAdmin();
