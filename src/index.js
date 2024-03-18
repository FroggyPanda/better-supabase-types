#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generate } from './generate.js';
import { z } from 'zod';
import fs from 'fs';

const configExists = fs.existsSync('.betterrc.json');
const prePackageJsonFile = fs.readFileSync('package.json', 'utf-8');
const packageJsonFile = JSON.parse(prePackageJsonFile);

const schema = z
  .object({
    input: z.string(),
    output: z.string().optional(),
    force: z.boolean().optional(),
    prettier: z.string().optional().default('.prettierrc'),
    singular: z.boolean().optional().default(false),
    enumAsType: z.boolean().optional().default(false),
    enumPascalCase: z.boolean().optional().default(false),
  })
  .strict();

// Load config from '.betterrc' file
if (configExists) {
  const prefile = fs.readFileSync('.betterrc.json', 'utf-8');
  const json = JSON.parse(prefile);

  // Check if config is correct
  const result = schema.safeParse(json);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.log('Invalid config file');
  } else {
    if (!result.data.output && !result.data.force) {
      // eslint-disable-next-line no-console
      console.log(
        'It looks like you want to overwrite your input file. Add the force property to do that in your config file.'
      );
    } else {
      const input = result.data.input;
      const output = result.data.output || result.data.input;
      const prettier = result.data.prettier;
      const singular = result.data.singular ?? false;
      const enumAsType = result.data.enumAsType ?? false;
      const enumPascalCase = result.data.enumPascalCase ?? false;

      generate(input, output, prettier, singular, enumAsType, enumPascalCase);
    }
  }
} else if (packageJsonFile['betterConfig']) {
  // Load config from 'package.json' file

  // Check if config is correct
  const result = schema.safeParse(packageJsonFile['betterConfig']);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.log('Invalid config in package.json');
  } else {
    if (!result.data.output && !result.data.force) {
      // eslint-disable-next-line no-console
      console.log(
        'It looks like you want to overwrite your input file. Add the force property to do that in your config file.'
      );
    } else {
      const input = result.data.input;
      const output = result.data.output || result.data.input;
      const prettier = result.data.prettier;
      const singular = result.data.singular ?? false;
      const enumAsType = result.data.enumAsType ?? false;
      const enumPascalCase = result.data.enumPascalCase ?? false;

      generate(input, output, prettier, singular, enumAsType, enumPascalCase);
    }
  }
} else {
  // Load config from command line
  yargs(hideBin(process.argv))
    .command(
      '*',
      '',
      (yargs) => {
        return yargs
          .options({
            input: {
              type: 'string',
              alias: ['i'],
              describe: 'Path to the input file',
              requiresArg: true,
            },
            output: {
              type: 'string',
              alias: ['o'],
              describe: 'Path to the output file',
              requiresArg: true,
            },
            prettier: {
              type: 'string',
              alias: ['p'],
              describe: 'Path to the prettier config file',
              requiresArg: false,
              default: '.prettierrc',
            },
            force: {
              type: 'boolean',
              alias: ['f'],
              describe: 'Force the overwrite of the input file',
            },
            singular: {
              type: 'boolean',
              alias: ['s'],
              describe:
                'Convert table names to singular form instead of plural form',
              requiresArg: false,
              default: false,
            },
            enumAsType: {
              type: 'boolean',
              describe: 'Have converted enums defined as types and not enums',
              requiresArg: false,
              default: false,
            },
            enumPascalCase: {
              type: 'boolean',
              describe: 'Enums format to pascal case',
              requiresArg: false,
              default: false,
            },
          })
          .demandOption(['input']);
      },
      (argv) => {
        if (!argv.output && !argv.force) {
          // eslint-disable-next-line no-console
          console.error(
            'It looks like you want to overwrite your input file. Add the force flag to do that.'
          );
          return;
        }

        const input = argv.input;
        const output = argv.output || argv.input;
        const prettier = argv.prettier;
        const singular = argv.singular ?? false;
        const enumAsType = argv.enumAsType ?? false;
        const enumPascalCase = argv.enumPascalCase ?? false;

        generate(input, output, prettier, singular, enumAsType, enumPascalCase);
      }
    )
    .help()
    .strict()
    .parse();
}
