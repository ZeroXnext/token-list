# Token List Builder
A modular toolchain for generating, validating, and maintaining Uniswap-compatible token lists. Includes a CLI, web interface, and automated GitHub workflows for rule-based token aggregation and versioning.


# Developing

## Requirements

- Node.js (v16 or later)
- Yarn (with Corepack enabled)
- Turborepo (included as a dev dependency)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate into the project directory:
   ```
   cd <project-directory>
   ```
3. Enable Corepack:
   ```
   corepack enable
   ```
4. Install dependencies using Yarn:
   ```
   yarn install
   ```

## Project Structure

- `packages/core`: Core libraries and utilities
- `packages/cli`: Command-line interface tools

## Notes

This is a monorepo managed with Turborepo. Each package (`core`, `cli`, `web`) can be developed and built independently or together through the root workspace commands.
