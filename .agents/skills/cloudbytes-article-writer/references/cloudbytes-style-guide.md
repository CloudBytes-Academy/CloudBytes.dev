# CloudBytes Writing Style Guide

## Voice

CloudBytes articles read like a practical walkthrough from an engineer who has already solved the setup once and is helping a beginner avoid wasted time.

Write with:

- Direct second person: "you need", "you can", "open a terminal", "run the following command".
- Inclusive walkthrough language: "we will", "let's", "in our case", "now".
- Plain explanations before code, not long theory sections.
- Concrete environments: Windows 10/11, WSL2, Ubuntu, AWS Console, AWS CLI, Python, CDK.
- A light personal touch when useful: "I personally use...", "E.g. in my case...".
- Practical caution: warn about credentials, deletion, costs, default retain behavior, permissions, and security groups.

Do not write like a generic corporate blog. Avoid openings such as "In today's fast-paced world", "delve into", "seamlessly leverage", or broad claims without a setup problem.

## Audience

Assume readers are new adopters who know basic programming but may not know the cloud service, Linux command, Python tool, or AWS workflow yet. They want to make the thing work first, then understand the important parts.

The article should answer:

- What are we trying to do?
- What do I need installed or configured?
- What command, file, or console action do I perform next?
- How do I know it worked?
- How do I clean it up or continue?

## Article Shapes

### Snippets

Use for a focused problem or small tool setup.

Shape:

1. Frontmatter.
2. One or two short paragraphs naming the scenario or problem.
3. Optional prerequisites.
4. Action headings such as "Install Jupyter Notebook", "Configure Git authentication", or "Run Selenium".
5. Commands with a short explanation before and after.
6. Verification step.

### AWS Academy

Use for course-style AWS and CDK tutorials.

Shape:

1. Frontmatter with `category: "AWS Academy"`, `categorySlug: "aws-academy"`, and `series`/`seriesIndex` when part of a sequence.
2. Short intro stating what will be created or configured.
3. Prerequisites or links to earlier lessons.
4. Main tutorial sections.
5. Code blocks with filename comments for multi-file examples.
6. Deploy/test/cleanup or next-article sections.
7. Internal links to related lessons.

### Concept Explainers

Use for topics such as Jamstack, Python implementations, CI/CD, or devcontainers.

Shape:

1. Define the term plainly.
2. Explain why it exists or what problem it solves.
3. Compare with familiar alternatives.
4. Give practical selection guidance.
5. End with what to try next.

### Book/Product Notes

Keep these short and value-led. State who the resource is for, what it covers, and where to get it.

## Frontmatter

Use the schema in `web/src/content.config.ts`.

Minimum post frontmatter:

```yaml
---
title: "How to create an S3 bucket using AWS CDK"
description: "How to create and configure an S3 bucket in AWS CDK using Python"
pubDate: "2026-05-31"
category: "AWS Academy"
categorySlug: "aws-academy"
slug: "create-s3-bucket-using-aws-cdk"
tags:
    - "aws"
    - "cdk"
    - "python"
keywords:
    - "aws"
    - "cdk"
    - "s3"
author: "Rehan Haider"
authorSlug: "rehan-haider"
series: "AWS CDK"
seriesIndex: 1000
---
```

Guidelines:

- Titles are direct and search-friendly: "How to...", "Create...", "Configure...", "What is...".
- Descriptions are plain one-sentence summaries, usually starting with "How to..." or "A guide to...".
- Keep tags narrow. Use broader keyword coverage in `keywords` when useful.
- Keep filenames lowercase and descriptive. Follow the existing numeric prefix convention when adding to a numbered series.
- Use `draft: true` for unfinished posts.

## Openings

Start close to the problem. A good opening is specific about the context and outcome.

Good patterns:

- "In this post, we'll create a new CDK app that uses Python as the programming language."
- "If you are using Git in WSL2, you might have noticed that you have to enter your username and password..."
- "This guide will walk you through the process of creating and configuring an S3 bucket using the AWS CDK in Python."

Avoid:

- Long history unless it helps the task.
- Abstract benefits before the reader knows what they are building.
- Hype-heavy product language.

## Structure And Headings

Use short, task-oriented headings:

- "Create an S3 bucket"
- "Configure Bucket Name"
- "Set environment variables"
- "Testing the Lambda function"
- "Cleanup"

Question headings are fine when the article is explanatory:

- "What is AWS CLI?"
- "When to use Jamstack?"
- "Why create multiple stacks?"

Prefer a visible workflow before long tutorials:

```markdown
To create an EC2 instance using AWS Management Console, we need to do the following:

1. Go to the AWS Management Console
2. Choose a region
3. Launch the instance
4. Choose the AMI
5. Choose the instance type
```

For console tutorials, lettered steps are common and match the existing voice:

```markdown
a) Click on **Instances** on the left navigation panel
b) Click on **Launch Instances**
c) Wait for the instance to be created
```

## Code And Commands

Code is the center of the article. Keep it runnable and explain only the parts the reader must understand.

Rules:

- Use fenced code blocks with language tags.
- Put filenames in comments for multi-file examples.
- Use placeholders like `<your-profile-file>`, `<bucket-name>`, or `<USERNAME>` for user-specific values.
- Explain important parameters after the code block.
- Include verification commands when possible.
- Include cleanup commands for cloud resources.

Preferred pattern:

````markdown
Create a new directory for the CDK app and navigate to it:

```bash
mkdir cdk-app && cd cdk-app
```

Then create a new CDK app:

```bash
cdk init app --language python
```
````

For CDK/Python examples, use filename comments:

```python
# filename: cdk_app/lambda_stack.py

from aws_cdk import Stack, aws_lambda as _lambda
from constructs import Construct
```

## Notes, Warnings, And Images

Use notes and warnings only when they prevent real mistakes.

Acceptable admonition style in this repo:

```markdown
!!! warning
    If you destroy the stack by running `cdk destroy`, the S3 bucket will not be deleted because the default removal policy is `Retain`.
```

Images should show actual UI state, command output, architecture, or verification results. Do not add decorative images. Use existing assets from `web/public/images/**` and reference them as `/images/...`.

## Internal Links

Link to earlier CloudBytes posts when the reader needs background or prerequisites. Existing migrated posts often use Pelican `{filename}` links; do not rewrite legacy links unless the task is link migration. For new content, prefer whichever internal-link style is already used in the nearest article or series.

## Style Patterns To Preserve

- "Run the following command..."
- "The above command will..."
- "You should see..."
- "If you get an error..."
- "Now, we can..."
- "Let's see how..."
- "In our case..."
- "E.g. ..."

Use these naturally; do not repeat the same phrase in every paragraph.

## Style Issues To Improve

Existing posts include some typos and migration artifacts. Treat them as content history, not as voice.

Improve:

- Spelling and grammar.
- Missing articles such as "a" and "the".
- Duplicate words.
- Overlong sentences.
- Outdated command names or service labels.
- Broken punctuation around code and links.

Do not improve by making the prose overly polished, formal, or detached.

## Technical Accuracy

When writing new articles, current technical details may have changed since older posts were written. Verify current facts from primary documentation when the article depends on:

- Latest package or runtime versions.
- AWS console labels, defaults, quotas, or managed policies.
- Security-sensitive configuration.
- Pricing, free-tier claims, or availability.
- CLI commands that install from external sources.

Say what was verified if the final response summarizes the work.

## Review Checklist

Before handing back a CloudBytes article:

- The frontmatter matches the content schema.
- The intro names the exact thing being built, fixed, or explained.
- The article has a clear path from prerequisite to verification.
- Every command is fenced and has a language tag.
- Code examples include filenames when multiple files are involved.
- AWS/cloud tutorials include cleanup or deletion guidance where appropriate.
- Warnings are practical and specific.
- Internal links are relevant and not excessive.
- The voice is helpful, direct, and practical, not generic AI prose.

## Source Samples

This guide was derived from representative posts in:

- `web/src/content/posts/snippets/99999999-create-a-python-virtual-environment.md`
- `web/src/content/posts/snippets/99999989-how-to-use-git-and-github.md`
- `web/src/content/posts/snippets/99999996-what-is-jamstack.md`
- `web/src/content/posts/snippets/99999958-run-jupyter-from-terminal.md`
- `web/src/content/posts/snippets/99999954-wsl2-git-authentication.md`
- `web/src/content/posts/aws-academy/00000000-setting-up-dev-env.md`
- `web/src/content/posts/aws-academy/12500000-aws-cli-intro.md`
- `web/src/content/posts/aws-academy/18750100-create-ec2-instance-console.md`
- `web/src/content/posts/aws-academy/50000020-cdk-new-app.md`
- `web/src/content/posts/aws-academy/50001000-cdk-s3-create-s3-bucket.md`
- `web/src/content/posts/aws-academy/50002000-cdk-fn-create-lambda.md`
- `web/src/content/posts/books/webapi-with-python.md`
