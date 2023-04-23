#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generate } from './generate';

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
          force: {
            type: 'boolean',
            alias: ['f'],
            describe: 'Force the overwrite of the input file',
          },
        })
        .demandOption(['input']);
    },
    (argv) => {
      if (!argv.output && !argv.force) {
        console.error(
          'It looks like you want to overwrite your input file. Add the force flag to do that.'
        );
        return;
      }

      const input = argv.input;
      const output = argv.output || argv.input;

      generate(input, output);
    }
  )
  .help()
  .strict()
  .parse();
