// Function to load and instantiate the WebAssembly module
function loadWebAssemblyModule(wasmFilePath) {
    return fetch(wasmFilePath)
        .then(response => response.arrayBuffer())
        .then(bytes => WebAssembly.instantiate(bytes))
        .then(obj => {
            return obj.instance.exports;
        })
        .catch(error => {
            console.error('Error loading WebAssembly module:', error);
        });
}

// Function to execute a command and display the result
function executeCommand() {
    const command = document.getElementById("commandInput").value;

    // Load and instantiate the WebAssembly module
    loadWebAssemblyModule('command_exec.wasm')
        .then(exports => {
            // Access the exported function '_executeCommand'
            const executeCommand = exports._executeCommand;

            // Convert JavaScript string to WebAssembly memory
            const commandPtr = exports._allocate(command.length + 1);
            const commandBuffer = new Uint8Array(
                exports.memory.buffer,
                commandPtr,
                command.length + 1
            );
            commandBuffer.set(new TextEncoder().encode(command + '\0'));

            // Call the exported function '_executeCommand' with the command pointer
            const resultPtr = executeCommand(commandPtr);

            // Convert WebAssembly memory to JavaScript string
            const resultBuffer = new Uint8Array(
                exports.memory.buffer,
                resultPtr
            );
            const result = new TextDecoder().decode(resultBuffer);

            // Display the result
            document.getElementById("result").innerText = result;

            // Free memory allocated by WebAssembly
            exports._freeMemory(commandPtr);
            exports._freeMemory(resultPtr);
        });
}
       
