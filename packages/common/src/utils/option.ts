export function option(obj: any, prop: string, defaultValue: any = null) {
    return (typeof obj[prop] === "undefined") ? defaultValue : obj[prop]
}