document.addEventListener('DOMContentLoaded', () => {
    const fileSelect = document.getElementById('file');
    const fileContent = document.getElementById('fileContent');
    const urlParams = new URLSearchParams(window.location.search);
    const selectedFile = urlParams.get('file');
    
    // Fetch and populate the list of log files
    fetch('/api/logs')
        .then(response => response.json())
        .then(data => {
            data.files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                fileSelect.appendChild(option);
            });

            if (selectedFile) {
                fileSelect.value = selectedFile;
                fetchAndDisplayFileContent(selectedFile);
            }
        });

    // Handle change event on file select
    fileSelect.addEventListener('change', () => {
        const selectedFile = fileSelect.value;
        if (selectedFile) {
            fetchAndDisplayFileContent(selectedFile);
            history.pushState(null, '', `?file=${selectedFile}`);
        }
    });

    // Fetch and display file content
    function fetchAndDisplayFileContent(file) {
        fetch(`/api/view?file=${file}`)
            .then(response => response.json())
            .then(data => {
                fileContent.innerHTML = `<h2>Contents of ${file}:</h2><pre>${data.content}</pre>`;
            })
            .catch(err => {
                fileContent.innerHTML = `<h2>Error:</h2><p>${err.message}</p>`;
            });
    }
});
