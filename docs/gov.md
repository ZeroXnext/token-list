# Governance model of 0xTrust chain

| Role Name | Details                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| Guardian  | Is a special user that runs a L2 node and can propose three auditors and earns incentitives                              |
| Auditor   | In essence, is a delegate from a specific organization e.g: Metamask that audits plugins and earns incentitives          |
| Developer | This role is any user that either can create a compilation of token list or simply develops plugins to earn incentitives |
| Compiler  | A program that enables running trusted plugins from the ecosystem                                                        |
| Runner    | The actual user that triggers a workflow run as per workflow configuration, this can be a application or actual user     |

## Architecture

| Storage | Details                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------- |
| L1      | Storeage for mapping of hashed(roots of auditors, developers, guardians, signed by node runner) |
| L2      | Storage for mapping of [guardian ID -> ownedSignature]                                          |
| L2      | Storage for mapping of [auditor ID -> ownedSignature]                                           |
| L2      | Storage for mapping of [developer ID -> ownedSignature]                                         |
| L2      | Storage for mapping of [plugin ID -> developerSignature]                                        |
| L2      | Storage for auditorTrust mapping of [plugin ID -> auditorId -> auditorSignature]                |

| L3 | Storage usef for mappings |

## Governance Rules

| Rule                   | Role involved                    | Details                                               | Requirement                                  |
| ---------------------- | -------------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| Proposing new Guardian | Guardians                        | Proposing a guardian requires approval                | stake + >= 3 guardians approval              |
| Proposing new Auditor  | Guardians and Auditor            | Proposing a new auditor requires Guardians approval   | auditor stake + >= 3 guardians approval      |
| New Developer join     | Auditor, Developer and Guardians | Joining as a new developer                            | developer stake + >= 1 (Auditor or Guardian) |
| Proposing new Plugin   | Developers and Auditors          | Developers only can propose a new plugin to be listed | At least one auditor                         |
| Compiler plugin        |
