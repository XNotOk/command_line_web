// Load the WebAssembly module
fetch('command_exec.wasm')
    .then(response => response.arrayBuffer())
    .then(bytes => WebAssembly.instantiate(bytes))
    .then(obj => {
        // Define JavaScript functions to interact with the WebAssembly module
        const { executeCommand } = obj.instance.exports;

        // Function to execute the command
        window.executeCommand = () => {
            const command = document.getElementById("commandInput").value;
            const resultPtr = executeCommand(allocateString(obj, command));
            const result = UTF8ToString(resultPtr);
            document.getElementById("result").innerText = result;
            _free(resultPtr); // Free memory allocated by WebAssembly
        };
    })
    .catch(error => {
        console.error('Error loading WebAssembly module:', error);
    });

// Utility function to allocate a string in WebAssembly memory
function allocateString(obj, str) {
    const length = lengthBytesUTF8(str) + 1;
    const ptr = obj.instance.exports.allocate(length);
    stringToUTF8(str, ptr, length);
    return ptr;
}
