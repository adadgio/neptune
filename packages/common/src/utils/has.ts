export function has(obj: any, props: Array<string>) {
    return Object.keys(obj).every(key => props.indexOf(key) > -1)
}