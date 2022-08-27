const redis = require('redis');
const client = redis.createClient({
    url: process.env.REDIS_URL
  });

client.connect();

client
    .on('connect', function () {
        console.log('Redis client connected');
    })
    .on('error', function (err) {
        console.log('Something went wrong ' + err);
    })

module.exports = client;