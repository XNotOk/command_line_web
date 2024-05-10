function executeCommand() {
    const command = document.getElementById("commandInput").value;

    // Load and instantiate the WebAssembly module
    fetch('command_exec.wasm')
        .then(response => response.arrayBuffer())
        .then(bytes => WebAssembly.instantiate(bytes))
        .then(obj => {
            // Access the exported function 'executeCommand'
            const executeCommand = obj.instance.exports.executeCommand;

            // Convert JavaScript string to WebAssembly memory
            const commandPtr = obj.instance.exports.allocate(
                command.length + 1 // Add 1 for null terminator
            );
            const commandBuffer = new Uint8Array(
                obj.instance.exports.memory.buffer,
                commandPtr,
                command.length + 1 // Add 1 for null terminator
            );
            commandBuffer.set(new TextEncoder().encode(command + '\0'));

            // Call the exported function 'executeCommand' with the command pointer
            const resultPtr = executeCommand(commandPtr);

            // Convert WebAssembly memory to JavaScript string
            const resultBuffer = new Uint8Array(
                obj.instance.exports.memory.buffer,
                resultPtr
            );
            const result = new TextDecoder().decode(resultBuffer);

            // Display the result
            document.getElementById("result").innerText = result;

            // Free memory allocated by WebAssembly
            obj.instance.exports.free(commandPtr);
            obj.instance.exports.free(resultPtr);
        })
        .catch(error => {
            console.error('Error loading WebAssembly module:', error);
        });
}
