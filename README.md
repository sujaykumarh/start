# Project Starter

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sujaykumarh/project.git)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/sujaykumarh/project)](https://www.npmjs.com/package/@sujaykumarh/project)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/sujaykumarh/project/Build%20&%20Publish%20package)](https://github.com/sujaykumarh/project/actions)

**Install globally with npm [optional]**

```sh
$ npm install -g @sujaykumarh/project

# To run the project
$ project new project-name
```

**Usage:**

init default config $HOME/.my-project-config.json

```sh
$ npx @sujaykumarh/project init
```

Create project

```sh
$ npx @sujaykumarh/project
```

**Options:**

```sh
$ npx @sujaykumarh/project <options>

-c, --config <path>     Path to config file
-h, --help              Show help
-v, --version           Show version
-d, --debug             Debug mode

-p, --path <path>       Path to project [default: ./]
-r, --repo <repo>       Repo name [default: config.repo]
-b, --branch <branch>   Branch name [default: main]
```

**Commands:**

```sh
$ npx @sujaykumarh/project <command> [options]

init                   Initialize project default config
help                   Show help
version                Show version

new                    Create new project

[options]

new <project-name>     create new project with name
```

<br>

### LICENSE

```license
The MIT License (MIT)

Copyright (c) 2021 Sujaykumar.Hublikar <hello@sujaykumarh.com>
```

Read full license [here](https://github.com/sujaykumarh/project/blob/main/LICENSE)