type AccessPath = string;
const OPERATIONS = {
    read: "read",
    remove: "remove",
    update: "update",
    add: "add",
} as const;

type Operations = typeof OPERATIONS[keyof typeof OPERATIONS];

class PathsOperations {
    public rules: Record<AccessPath, Operations[]>;
    constructor(private schema: JSON) {
        this.rules = {}
    }
    makePaths() { }
    getPath() { }
}