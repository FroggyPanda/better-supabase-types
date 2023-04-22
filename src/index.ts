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
        })
        .demandOption(['input', 'output']);
    },
    (argv) => {
      generate(argv.input, argv.output);
    }
  )
  .help()
  .strict()
  .parse();
