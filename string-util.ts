/**
 * @example
 * capitalize('foo bar') // "Foo bar"
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * @example
 * capitalizeAll('foo bar') // "Foo Bar"
 */
export function capitalizeAll(str: string): string {
    return str.split(/\s/g).map(word => capitalize(word)).join(' ');
}

/**
 * @example
 * pascal('foo bar') // "FooBar"
 */
export function pascal(str: string): string {
    return capitalizeAll(str).replace(/\s/g, '');
}

/**
 * @example
 * camel('foo bar') // "fooBar"
 */
export function camel(str: string): string {
    const val = pascal(str);
    return val.charAt(0).toLocaleLowerCase() + val.slice(1);
}

/**
 * @example
 * upperCamelToTitle('FOO_BAR') // "Foo Bar"
 */
export function upperSnakeToTitle(str: string): string {
    return capitalizeAll(str.replace(/_/g, ' '));
}

/**
 * @example
 * upperCamelToPascal('FOO_BAR') // "FooBar"
 */
export function upperSnakeToPascal(str: string): string {
    return upperSnakeToTitle(str).replace(/\s/g, '');
}

/**
 * @example
 * upperCamelToCamel('FOO_BAR') // "fooBar"
 */
export function upperSnakeToCamel(str: string): string {
    const pascal = upperSnakeToPascal(str);
    return pascal.charAt(0).toLocaleLowerCase() + pascal.slice(1);
}
