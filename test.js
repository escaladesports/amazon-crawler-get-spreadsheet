'use strict'
const app = require('./index')
app()
	.then(console.log)
	.catch(console.error)