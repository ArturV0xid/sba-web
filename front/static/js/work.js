async function sendPostRequest(url, binaryString) {
    const formData = new FormData();
    formData.append('file', binaryString);

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    return await response.text();
}

// Функция для чтения содержимого файла в виде бинарной строки
async function readFileAsBinaryString(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const binaryString = reader.result;
            resolve(binaryString);
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
    });
}

document.getElementById("send_data").addEventListener('click', async () => {
    const file = document.getElementById('fileToUpload').files[0];
    const arrayBuffer = await file.arrayBuffer();
    const binaryString = new TextDecoder().decode(arrayBuffer);
    await sendPostRequest('/orders/upload-file', binaryString);
});
