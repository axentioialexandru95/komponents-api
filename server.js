// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/', async (request, reply) => {
    return 'Hello guys'
})

// DB connection
fastify.register(require('fastify-mysql'), {
    connectionString: 'mysql://root@localhost/wc_admin'
})

fastify.get('/api/components', (req, reply) => {

    fastify.mysql.getConnection(onConnect)

    function onConnect(err, client) {
        if (err) return reply.send(err)

        client.query(
            'SELECT * from component',
            function onResult(err, result) {
                client.release()
                reply.send(err || result)
            }
        )
    }
})

fastify.get('/api/components/:id', (req, reply) => {

    fastify.mysql.getConnection(onConnect)

    function onConnect(err, client) {
        if (err) return reply.send(err)

        client.query(
            `SELECT * from component where ID=${req.params.id}`,
            function onResult(err, result) {
                client.release()
                reply.send(err || result)
            }
        )
    }
})

fastify.post('/api/createComponent', (req, reply) => {

    fastify.mysql.getConnection(onConnect)

    function onConnect(err, client) {
        if (err) return reply.send(err)

        client.query(
            `INSERT INTO component (component_name, component_description, component_location)
            VALUES ('${req.body.componentName}', '${req.body.componentDescription}', '${req.body.componentLocation}')`
            ,
            function onResult(err, result) {
                client.release()
                reply.send(err || result)
            }
        )
    }
})

fastify.post('/api/deleteComponent/:id', (req, reply) => {

    fastify.mysql.getConnection(onConnect)

    function onConnect(err, client) {
        if (err) return reply.send(err)

        client.query(
            `DELETE from component WHERE id=${req.params.id}`,
            function onResult(err, result) {
                client.release()
                reply.send(err || result)
            }
        )
    }
})


fastify.post('/api/updateComponent/:id', (req, reply) => {

    fastify.mysql.getConnection(onConnect)

    function onConnect(err, client) {
        if (err) return reply.send(err)

        client.query(
            `UPDATE component
            SET component_name = '${req.body.componentName}', 
            component_description = '${req.body.componentDescription}', 
            component_location = '${req.body.componentLocation}'
            WHERE id=${req.params.id};`,
            function onResult(err, result) {
                client.release()
                reply.send(err || result)
            }
        )
    }
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()

