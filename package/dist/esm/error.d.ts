declare type GenericObject = Record<string, unknown>;
declare type Context = GenericObject | string | number | null | undefined;
export declare class InformativeError extends Error {
    protected context?: Context;
    constructor(message?: string, context?: Context);
    protected stringifyContext(context: Context | string | number | null | undefined): string;
    toString(): string;
}
export {};
//# sourceMappingURL=error.d.ts.map