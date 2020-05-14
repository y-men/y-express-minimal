import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const express = require('express');
const router = express.Router();
const redis = require("redis");
//const client = redis.createClient('redis://redis:6379');
const client = redis.createClient( process.env['NODEMIN.REDIS_URL'] ?? null);
// const client = redis.createClient();

/**
 * Resolve async answer from redis
 * @param key
 * @param method
 * @param vals
 * @returns {Promise<unknown>}
 */
const dbCall = (method = 'get', key, ...vals) => {
  const promise = new Promise((resolve, reject) => {
    client[method](key, ...vals, (err, reply) => {
      if (err) reject(err)
      else
        resolve(reply)
    })
  })
  return promise;
};


// todo If there is no redis - craches very unelgantly

/**
 * @swagger
 * path:
 *  /cache/{key}:
 *    get:
 *      summary: Get a cache entry by key
 *      parameters:
 *        - in: path
 *          name: key
 *          schema:
 *            type: string
 *          required: true
 *          description: Key of the entry
 *      responses:
 *        "200":
 *          description: An users object
 *          content:
 *            application/json:
 */
router.get('/cache', async (req, res, next) => {
  const key = req.query?.key
  const d = {}
  // console.log(`key: ${key}`)
  const promise = dbCall('get', key);
  const value = await promise ?? `NA`
  d[key] = value
  res.json(d);
});


router.post('/cache', async (req, res, next) => {
  const key = req.query?.key
  const body = req.body
  const promise = dbCall('set', key, JSON.stringify(body));
  const value = await promise ?? `NA`
  res.json(`OK: ${value}`);
});


// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express Minimal",
      version: "1.0.0",
      description:
        "An Express minimal application",
    },
    servers: [
      {
        url: "http://localhost:3000/api/cache"
      }
    ]
  },
  apis: ['./routes/index.js']
};

const specs = swaggerJsdoc(options);
router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(specs, {explorer: true}) );


// todo Why does not work, scoping of internal call ? : this.internal_send_command
// function asyncCall(f, key) {
//   const promise = new Promise((resolve, reject) => {
//     try {
//       f(key, (err, reply) => resolve(reply))
//     } catch (e) {
//       reject( e)
//     }
//   })
//   return promise;
// }
//----

module.exports = router;
