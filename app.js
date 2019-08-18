const express = require('express')
const app = express()
const port = process.env.PORT || 6001

app.get('/', (req, res) => res.json({
	test: 1,
}))

app.listen(port, () => {
	console.log(`Server listening on port ${port}!`)
})
