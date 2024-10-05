const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
	try {
		const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
		let matchTag = process.env.MATCH_TAG || ''

		const { owner, repo } = github.context.repo

		if (!matchTag) {
			const { data: tags } = await octokit.rest.repos.listTags({ owner, repo, per_page: 100 })
			if (!tags.length) {
				core.setOutput('tag-name', '')
				return false
			}
			matchTag = tags[0].name
		}

		const { data: releases } = await octokit.rest.repos.listReleases({ owner, repo, per_page: 100 })
		const release = releases.find(release => release.tag_name === matchTag)
		core.setOutput('tag-name', release ? '' : matchTag)
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
