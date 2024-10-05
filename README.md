# Get Tag for Next Release

A GitHub Action that retrieves the latest tag from a repository and checks if it's already associated with a release. It outputs the tag name if it's not attached to a release, or an empty string if it is.

### Features

- Retrieves the most recent tag from your repository
- Checks if the latest tag is already associated with a release
- Provides a simple output for use in subsequent workflow steps
- Supports debug mode for troubleshooting
- Allows specifying a specific tag to check against releases

### How It Works

This action uses the GitHub API to fetch the latest tag and list of releases for your repository. It then compares the latest tag (or a specified tag) with existing releases to determine if a new release is needed. The action is written in Node.js and utilizes the `@actions/core` and `@actions/github` packages to interact with the GitHub Actions environment.

## Getting Started

### Quick Start

To use this action in your workflow, add the following step to your `.github/workflows/your-workflow.yml` file:

```yaml
- name: Get tag
  id: get_tag
  uses: pfaciana/get-tag-for-next-release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

- name: Use the output
  run: echo "The tag for the next release is ${{ steps.get_tag.outputs.tag-name }}"
```

## Usage

### Full Usage

To fully utilize this action in your workflow, you can incorporate it into a more comprehensive release process. Here's an example of a complete workflow that checks for a new tag, creates a release if necessary, and includes error handling:

```yaml
name: Release Management

on:
  workflow_dispatch:
  push:
    branches:
      - master

jobs:
  get-tag-name:
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Get tag
        id: get_tag_name
        uses: pfaciana/get-tag-for-next-release
        with:
          match-tag: 'v1.2.3' # Optional: Specify a tag to check against releases
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          DEBUG_MODE: ${{ vars.DEBUG_MODE || '0' }}

      - name: Debug output
        run:
          echo "Latest tag not attached to a release: ${{ steps.get_tag.outputs.tag-name }}"
```

### Inputs

| Name      | Description                             | Required | Default |
|-----------|-----------------------------------------|----------|---------|
| match-tag | The tag name to match a release against | false    | ''      |

> Typically, this will be a dynamic value from another workflow step or command line output.

### Outputs

| Name     | Description                                                                               |
|----------|-------------------------------------------------------------------------------------------|
| tag-name | The name of the latest tag if it's not attached to a release, or an empty string if it is |

## FAQ

### Q: What happens if there are no tags in the repository?

A: If there are no tags in the repository, the action will output an empty string for the `tag-name`.

### Q: Does this action create a release?

A: No, this action only checks if the latest tag is associated with a release. You would need to use another action (like `actions/create-release`) to actually create the release.

### Q: Can this action create a new tag?

A: No, this action only checks existing tags. It does not create new tags or releases.

### Q: How does this action handle multiple tags pushed at once?

A: The action considers the most recent tag if no specific tag is provided. If multiple tags are pushed simultaneously, only the latest one will be checked.

### Q: Can I use this action with private repositories?

A: Yes, as long as the `GITHUB_TOKEN` has the necessary permissions to access the repository's tags and releases.

### Q: Can I specify a particular tag to check against releases?

A: Yes, you can use the `match-tag` input to specify a particular tag. If left empty, the action will use the latest tag.
