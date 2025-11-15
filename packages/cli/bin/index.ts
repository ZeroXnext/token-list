#!/usr/bin/env node
import {entry} from '../src';
import addBumpCommand from '../src/commands/bump';
import addGenerateCommand from '../src/commands/generate';

addGenerateCommand(entry);
addBumpCommand(entry);
entry.strictCommands().parse();
