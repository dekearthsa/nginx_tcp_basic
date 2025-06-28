import Fastify from 'fastify';
import { MongoClient } from 'mongodb';

const fastify = Fastify({ logger: true });


const MONGO_URI = 'mongodb://root:root@0.tcp.ap.ngrok.io:18673/?authSource=admin';
const client = new MongoClient(MONGO_URI, {
    tls: false,
    serverSelectionTimeoutMS: 5000
});

await client.connect();
fastify.log.info('MongoDB connected');

const db = client.db('test_101');
const col = db.collection('test_101');

fastify.post('/insert', async (request, reply) => {
    try {
        const payload = Object.keys(request.body || {}).length
            ? request.body
            : { version: '111' };

        const result = await col.insertOne(payload);
        return reply.code(201).send({ insertedId: result.insertedId });
    } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ message: 'insert failed' });
    }
});

fastify.listen({ port: 3011, host: '0.0.0.0' }, err => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info('🚀 Fastify listening on http://localhost:3011');
});
