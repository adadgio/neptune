export function has(obj: any, props: Array<string>) {
    if (typeof obj === "undefined" || null === obj) { return false }
    return props.every(prop => Object.keys(obj).indexOf(prop) > -1)
}