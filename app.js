const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
const redis = require('redis')

const port = process.env.PORT || 6001
const ISSUES_API_ENDPOINT = 'https://api.github.com/repos/syed-mohsin/github-issue-assigner/issues'
axios.defaults.headers.post['Authorization'] = `token ${process.env.GITHUB_API_ACCESS_TOKEN}`

const redisClient = redis.createClient(process.env.REDIS_URL)
redisClient.on("error", err => {
    console.log("Redis Error:", err)
});

const USERNAMES = ['syed-mohsin']

app.use(bodyParser.json())

app.post('/', (req, res) => {
	const action = req.body.action
	const { id, number } = req.body.issue

	const payload = {
		success: true,
		action: action,
		issueId: id,
		issueNumber: number,
	}

	if (action === 'opened') {
		redisClient.watch('assigneeIndex', err => {
			if (err) {
				return console.warn('err', err)
			}

			redisClient.get('assigneeIndex', (err, res) => {
				if (err) {
					return console.warn('err', err)
				}

				const assigneeIndex = Number(res) || 0
				axios.post(`${ISSUES_API_ENDPOINT}/${number}/assignees`, {
					assignees: USERNAMES[assigneeIndex]
				}).then(() => {
					redisClient.multi()
						.set('assigneeIndex', (assigneeIndex + 1) % USERNAMES.length)
						.exec((err) => {
							if (err) {
								return console.warn('err', err)
							}
						})
				})
			})
		})
	}

	res.json(payload)
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}!`)
})
