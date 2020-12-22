export class InformativeError extends Error {
    constructor(message, context) {
        super(message);
        this.context = context;
    }
    stringifyContext(context) {
        if (context && typeof context === 'object') {
            context = copyWithoutCircularReferences([context], context);
        }
        return JSON.stringify(context, undefined, 2);
    }
    toString() {
        return `${this.name}: ${this.message} with context\n ${this.stringifyContext(this.context)}`;
    }
}
function copyWithoutCircularReferences(references, object, depth = 0) {
    const cleanObject = {};
    Object.keys(object).forEach(function (key) {
        const value = object[key];
        if (value && typeof value === 'object') {
            if (!references.includes(value)) {
                references.push(value);
                cleanObject[key] =
                    ++depth < 10
                        ? copyWithoutCircularReferences(references, value, depth)
                        : '#TRUNCATED#';
                references.pop();
            }
            else {
                cleanObject[key] = '#CIRCULAR#';
            }
        }
        else if (typeof value !== 'function') {
            cleanObject[key] = value;
        }
    });
    return cleanObject;
}
