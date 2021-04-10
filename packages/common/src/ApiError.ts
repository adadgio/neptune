export class ApiError {
    $string: string
    $json: any = {}
    
    constructor(error: any) {
        if (typeof error === "string") {
            this.$string = error
        } else {
            this.$string = error.toString()
            this.$json = JSON.parse(JSON.stringify(error, ["message", "arguments", "type", "name"]))
        }
    }

    string() {
        return { type: "error", message: this.$string, stack: {}}
    }

    json() {
        return { type: "error", message: this.$string, stack: this.$json }
    }
}