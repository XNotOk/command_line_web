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
            const result = executeCommand(command);
            document.getElementById("result").innerText = result;
        };
    })
    .catch(error => {
        console.error('Error loading WebAssembly module:', error);
    });
