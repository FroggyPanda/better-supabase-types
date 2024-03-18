[![npm version](https://img.shields.io/npm/v/better-supabase-types.svg?style=for-the-badge)](https://www.npmjs.com/package/better-supabase-types) [![npm](https://img.shields.io/npm/dt/better-supabase-types.svg?style=for-the-badge)](https://www.npmjs.com/package/better-supabase-types) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

# Better Supabase Types

A CLI tool to add exports for your supabase tables. It will add type exports at the bottom of a new typescript file of every table you have. This tool can help remove the need to make a type for their rows manually.

### Before 📉

```ts
import { Database } from './src/schema.ts';

type Todo = Database['public']['Tables']['Todo']['Row'];

const todos: Todo[] = [];
```

### After 📈

```ts
import { Todo } from './src/newSchema.ts';

const todos: Todo[] = [];
```

## Usage 🔨

1. First have your supabase typescript file generated [Supabase Docs](https://supabase.com/docs/reference/javascript/typescript-support)

```bash
npx supabase gen types typescript --linked --schema public > ./src/schema.ts
```

2. Run the `better-supabase-types` command (you can also use a [config file](#config-file-⚙)):

```bash
npx better-supabase-types -i ./src/schema.ts -o ./src/newSchema.ts
```

## Commands 💻

```
Options:
      --version         Show version number                            [boolean]
      --help            Show help                                      [boolean]
  -i, --input           Path to the input file               [string] [required]
  -o, --output          Path to the output file                         [string]
  -p, --prettier        Path to the prettier config file
                                               [string] [default: ".prettierrc"]
  -f, --force           Force the overwrite of the input file          [boolean]
  -s, --singular        Convert table names to singular form instead of plural form
                                                      [boolean] [default: false]
      --enumAsType      Have converted enums defined as types and not enums
                                                      [boolean] [default: false]
      --enumPascalCase  Enums format to pascal case   [boolean] [default: false]
```

### Config file ⚙

You can also use a config named `.betterrc.json`:

```json
{
  "input": "./src/schema.ts",
  "force": true,
  "singular": true
}
```

#### package.json 📦

You can also put your config file in your `package.json` file:

```json
{
  "name": "better-supabase-types",
  "...": "...",
  "betterConfig": {
    "input": "./schema.ts",
    "output": "./newSchema.ts"
  }
}
```

## Contributions ➕

Please contribute to this if you find any bugs or want any additions. This is my first public package so please bear with me if there are any issues.

### Thanks 🙏

Big thanks to [Barry](https://github.com/barrymichaeldoyle) for making the [Supabase React Query Codegen](https://github.com/barrymichaeldoyle/supabase-react-query-codegen) tool to help me understand on how to read the supabase type file.
