#!/usr/bin/env node
import {entry} from '../src';
import addBumpCommand from '../src/commands/bump';
import addGenerateCommand from '../src/commands/generate';
import addAggregate from '../src/commands/aggregate';
import {loader} from '@tokenlist-builder/core';

const config = await loader();

addGenerateCommand(entry, config);
addBumpCommand(entry, config);
addAggregate(entry, config);
entry.strictCommands().parse();
