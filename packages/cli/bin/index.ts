#!/usr/bin/env node
import {entry} from '../src';
import generateCommand from '../src/commands/generate';

generateCommand(entry);
entry.strictCommands().parse();
