/**
 * Glossary terms surfaced at /learn/glossary/.
 *
 * Each entry becomes a citable `DefinedTerm` JSON-LD entity. Optional
 * `sameAs[]` URLs anchor the term to canonical sources (Wikipedia, AWS docs,
 * IETF) for AI-search alignment.
 */
export interface GlossaryTerm {
    slug: string;
    term: string;
    category: string;
    definition: string;
    sameAs?: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
    // AWS / Cloud
    {
        slug: "aws-cdk",
        term: "AWS CDK",
        category: "AWS",
        definition:
            "AWS Cloud Development Kit — an open-source framework for defining AWS infrastructure as code in TypeScript, Python, Java, C#, or Go. The CDK synthesises programs into AWS CloudFormation templates that AWS deploys on your behalf.",
        sameAs: ["https://docs.aws.amazon.com/cdk/v2/guide/home.html"],
    },
    {
        slug: "aws-lambda",
        term: "AWS Lambda",
        category: "AWS",
        definition:
            "Amazon's event-driven, serverless compute service. Run code in response to triggers (HTTP, S3 events, EventBridge, etc.) without provisioning servers. Billed per invocation and millisecond of execution.",
        sameAs: ["https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"],
    },
    {
        slug: "amazon-s3",
        term: "Amazon S3",
        category: "AWS",
        definition:
            "Amazon Simple Storage Service — object storage with virtually unlimited capacity, organised into buckets. Used for static assets, backups, data lakes, and Lambda code artefacts.",
        sameAs: ["https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html"],
    },
    {
        slug: "amazon-ec2",
        term: "Amazon EC2",
        category: "AWS",
        definition:
            "Elastic Compute Cloud — Amazon's virtual-server-as-a-service. EC2 instances are virtual machines you launch from images (AMIs) into a VPC, with configurable CPU, memory, networking, and storage.",
        sameAs: ["https://docs.aws.amazon.com/ec2/"],
    },
    {
        slug: "amazon-vpc",
        term: "Amazon VPC",
        category: "AWS",
        definition:
            "Virtual Private Cloud — an isolated, logically separate network inside AWS where you launch EC2 instances and other resources. Includes subnets, route tables, internet gateways, and security groups.",
        sameAs: ["https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html"],
    },
    {
        slug: "iam",
        term: "AWS IAM",
        category: "AWS",
        definition:
            "Identity and Access Management — AWS's permissions system. Defines users, roles, and policies that control who can perform which actions on which AWS resources.",
        sameAs: ["https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html"],
    },
    {
        slug: "amazon-efs",
        term: "Amazon EFS",
        category: "AWS",
        definition:
            "Elastic File System — managed, network-mounted POSIX filesystem accessible from EC2, Lambda, and on-prem servers. Scales elastically; pay per GB stored.",
        sameAs: ["https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html"],
    },
    {
        slug: "amazon-fsx-lustre",
        term: "Amazon FSx for Lustre",
        category: "AWS",
        definition:
            "Managed high-performance Lustre filesystem on AWS. Designed for HPC, ML, and media workloads where throughput and parallel access matter more than long-term storage cost.",
        sameAs: ["https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html"],
    },
    {
        slug: "aws-sam",
        term: "AWS SAM",
        category: "AWS",
        definition:
            "Serverless Application Model — an open-source framework for defining serverless apps (Lambda, API Gateway, DynamoDB) using a shorthand YAML on top of CloudFormation.",
        sameAs: ["https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html"],
    },
    {
        slug: "cloudformation",
        term: "AWS CloudFormation",
        category: "AWS",
        definition:
            "AWS's infrastructure-as-code service. CloudFormation deploys stacks of AWS resources defined in JSON or YAML templates; AWS CDK and AWS SAM both compile down to CloudFormation under the hood.",
        sameAs: ["https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html"],
    },
    {
        slug: "amazon-rds",
        term: "Amazon RDS",
        category: "AWS",
        definition:
            "Relational Database Service — managed Postgres, MySQL, MariaDB, Oracle, SQL Server, and Aurora databases on AWS. RDS handles backups, replicas, patching, and failover.",
        sameAs: ["https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html"],
    },
    {
        slug: "aws-dms",
        term: "AWS DMS",
        category: "AWS",
        definition:
            "Database Migration Service — moves data from a source database (on-prem or cloud) to a target database with minimal downtime. Supports homogeneous and heterogeneous migrations.",
        sameAs: ["https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"],
    },

    // Linux / Windows
    {
        slug: "wsl2",
        term: "WSL2",
        category: "Linux",
        definition:
            "Windows Subsystem for Linux v2 — runs a real Linux kernel inside a lightweight VM on Windows 10/11. Lets developers run Ubuntu (or other distros) alongside Windows with near-native performance.",
        sameAs: ["https://learn.microsoft.com/en-us/windows/wsl/"],
    },
    {
        slug: "ubuntu",
        term: "Ubuntu",
        category: "Linux",
        definition:
            "A widely used Debian-based Linux distribution maintained by Canonical. Ships with apt as its package manager and a six-month release cadence, with LTS releases every two years.",
        sameAs: ["https://ubuntu.com/"],
    },
    {
        slug: "hyper-v",
        term: "Hyper-V",
        category: "Windows",
        definition:
            "Microsoft's hypervisor, built into Windows 10/11 Pro and Enterprise (and enabled on Home via a sideload script). Hosts virtual machines including the Linux kernel that powers WSL2.",
        sameAs: ["https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/"],
    },
    {
        slug: "ssh",
        term: "SSH",
        category: "Linux",
        definition:
            "Secure Shell — a cryptographic network protocol for operating remote services securely. Common uses: remote terminal sessions, file transfer (scp/sftp), and authenticating Git pushes.",
        sameAs: ["https://en.wikipedia.org/wiki/Secure_Shell"],
    },

    // Python ecosystem
    {
        slug: "python-venv",
        term: "Python venv",
        category: "Python",
        definition:
            "Python's built-in virtual-environment module (`python -m venv`). Creates a per-project Python interpreter with its own `pip` and isolated packages, avoiding system-wide dependency conflicts.",
        sameAs: ["https://docs.python.org/3/library/venv.html"],
    },
    {
        slug: "pip",
        term: "pip",
        category: "Python",
        definition:
            "The reference package installer for Python. Reads requirements from PyPI and installs them into the active environment (system or virtualenv).",
        sameAs: ["https://pip.pypa.io/en/stable/"],
    },
    {
        slug: "fastapi",
        term: "FastAPI",
        category: "Python",
        definition:
            "A modern Python web framework built on Starlette and Pydantic. Uses type hints to generate OpenAPI docs, request/response validation, and dependency-injection patterns out of the box.",
        sameAs: ["https://fastapi.tiangolo.com/"],
    },
    {
        slug: "flask",
        term: "Flask",
        category: "Python",
        definition:
            "A long-standing Python micro-framework for building web applications and APIs. Minimal core, big ecosystem; used inside Airbnb, Netflix, Uber, and many smaller services.",
        sameAs: ["https://flask.palletsprojects.com/"],
    },
    {
        slug: "selenium",
        term: "Selenium",
        category: "Python",
        definition:
            "A browser-automation library used for end-to-end UI testing and headless web scraping. Drives Chrome, Firefox, and other browsers via the WebDriver protocol.",
        sameAs: ["https://www.selenium.dev/"],
    },
    {
        slug: "jupyter-notebook",
        term: "Jupyter Notebook",
        category: "Python",
        definition:
            "An interactive document format combining code, prose, and rich output. Common in data science and prototyping; runs Python via IPython by default but supports many other kernels.",
        sameAs: ["https://jupyter.org/"],
    },

    // Web / static site
    {
        slug: "jamstack",
        term: "Jamstack",
        category: "Web",
        definition:
            "An architecture where the frontend is a pre-built static bundle (JavaScript + Markup) that talks to APIs at runtime. Pages are CDN-cached, simplifying scale, security, and performance.",
        sameAs: ["https://jamstack.org/"],
    },
    {
        slug: "astro",
        term: "Astro",
        category: "Web",
        definition:
            "An Islands-architecture web framework that ships zero JavaScript by default. Renders to HTML at build time and lets you opt into React/Vue/Svelte/etc. for individual interactive components.",
        sameAs: ["https://astro.build/"],
    },
    {
        slug: "pelican",
        term: "Pelican",
        category: "Web",
        definition:
            "A Python static-site generator that takes Markdown/reStructuredText posts and themes them into a static blog. CloudBytes/dev was originally built on Pelican before migrating to Astro.",
        sameAs: ["https://getpelican.com/"],
    },
    {
        slug: "firebase-hosting",
        term: "Firebase Hosting",
        category: "Web",
        definition:
            "Google's static-site hosting service with global CDN, custom domains, and an emulator suite for local previews. Used to host CloudBytes/dev.",
        sameAs: ["https://firebase.google.com/docs/hosting"],
    },
    {
        slug: "github-actions",
        term: "GitHub Actions",
        category: "DevOps",
        definition:
            "GitHub's built-in CI/CD platform. Workflows run in YAML-defined jobs triggered by events (push, pull_request, schedule, etc.) inside hosted runners.",
        sameAs: ["https://docs.github.com/en/actions"],
    },
    {
        slug: "docker",
        term: "Docker",
        category: "DevOps",
        definition:
            "A platform for building and running containerised applications. Containers package code and dependencies in a portable image format that runs identically on a developer laptop, CI runner, and AWS Lambda or ECS.",
        sameAs: ["https://www.docker.com/"],
    },
];
