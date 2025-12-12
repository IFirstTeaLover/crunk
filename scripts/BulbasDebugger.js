const ds = localStorage
let whole = []
function debugInfo(info) {
    whole.push("INFO: " + info)
    ds.setItem("bdebug", whole)
}
function showDebugInConsole() {
    whole.forEach(a => {
        console.log(a)
    })
}