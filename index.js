const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
	try {
		const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
		const { owner, repo } = github.context.repo

		const { data: tags } = await octokit.rest.repos.listTags({ owner, repo, per_page: 1 })
		if (!tags.length) {
			core.setOutput('tag-name', '')
			return false
		}

		const { data: releases } = await octokit.rest.repos.listReleases({ owner, repo })
		const release = releases.find(release => release.tag_name === tags[0].name)
		core.setOutput('tag-name', release ? '' : tags[0].name)
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
