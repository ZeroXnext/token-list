#!/usr/bin/env node
import { entry } from '../src';
import addBumpCommand from '../src/commands/bump';
import addAggregate from '../src/commands/aggregate';
import addSync from '../src/commands/sync';
import { loader } from '@0xlist/core';

const config = await loader('0xlist');

addSync(entry, config);
addAggregate(entry, config);
addBumpCommand(entry, config);
entry.strictCommands().parse();
