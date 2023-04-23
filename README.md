[![npm version](https://img.shields.io/npm/v/better-supabase-types.svg?style=for-the-badge)](https://www.npmjs.com/package/better-supabase-types) [![npm](https://img.shields.io/npm/dt/better-supabase-types.svg?style=for-the-badge)](https://www.npmjs.com/package/better-supabase-types) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

# Better Supabase Types

---

A CLI tool to add exports for your supabase tables. It will add type exports at the bottom of a new typescript file of every table you have. This tool can help remove the need to make a type for their rows manually.

## Usage 🔨

1. First have your supabase typescript file generated [Supabase Docs](https://supabase.com/docs/reference/javascript/typescript-support)

```bash
npx supabase gen types typescript --linked --schema public > ./src/schema.ts
```

2. Run the `better-supabase-types` command!

```bash
npx better-supabase-types -i ./src/schema.ts -o ./src/newSchema.ts
```

### Before 📉:

```ts
import { Database } from './src/schema.ts';

type Todo = Database['public']['Tables']['Todo']['Row'];

const todos: Todo[] = [];
```

### After 📈:

```ts
import { Todo } from './src/newSchema.ts';

const todos: Todo[] = [];
```

## Thanks 🙏

Big thanks to [Barry](https://github.com/barrymichaeldoyle) for making the [Supabase React Query Codegen](https://github.com/barrymichaeldoyle/supabase-react-query-codegen) tool to help me understand on how to read the supabase type file.

## Todo 📃

- [ ] Have it possible to either make a new file or overwrite the input file
- [ ] Add option to take in prettier config

## Contributions ➕

Please contribute to this if you find any bugs or want any additions. This is my frist public package so please bear with me if there are any
