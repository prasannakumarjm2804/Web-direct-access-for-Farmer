/**
 * One-time fix script: drops the bad email_1 index from the users collection.
 * After running this, restart the backend server and Mongoose will
 * recreate the index as { unique: true, sparse: true } automatically.
 *
 * Run with:  node fix-email-index.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agriconnect';

async function fixEmailIndex() {
    console.log('🔌 Connecting to MongoDB:', MONGODB_URI.replace(/\/\/(.+?)@/, '//***@'));
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    const db = mongoose.connection.db;

    // Try both database names (test and agriconnect)
    for (const dbName of [db.databaseName, 'test']) {
        try {
            const collection = mongoose.connection.client.db(dbName).collection('users');
            const indexes = await collection.indexes();
            console.log(`\n📋 Indexes in [${dbName}].users:`);
            indexes.forEach(idx => console.log(' -', JSON.stringify(idx)));

            const emailIndex = indexes.find(i => i.name === 'email_1');
            if (emailIndex) {
                if (emailIndex.sparse && emailIndex.unique) {
                    console.log(`✅ [${dbName}] email_1 index is already correct (unique+sparse). No action needed.`);
                } else {
                    console.log(`⚠️  [${dbName}] email_1 index is bad (sparse=${emailIndex.sparse}, unique=${emailIndex.unique}). Dropping...`);
                    await collection.dropIndex('email_1');
                    console.log(`✅ [${dbName}] Dropped email_1 index successfully!`);
                }
            } else {
                console.log(`ℹ️  [${dbName}] No email_1 index found.`);
            }
        } catch (e) {
            if (!e.message.includes('ns does not exist')) {
                console.log(`ℹ️  [${dbName}]:`, e.message);
            }
        }
    }

    await mongoose.disconnect();
    console.log('\n🎉 Done! Now restart your backend server (npm run dev).');
    console.log('   Mongoose will recreate a correct unique+sparse email index automatically.');
}

fixEmailIndex().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
