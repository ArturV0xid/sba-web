
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

new DataTable('#example', {
    paging: false,
    scrollCollapse: true,
    scrollY: '50vh'
});

const dateButton  = document.getElementById('dateButton')
dateButton.addEventListener('click', async () => {
    // console.log(typeof(document.getElementById('startDate').value));
    // console.log(document.getElementById('endDate').value);

    const startDate = document.getElementById('startDate').value; // ваша минимальная дата
  const endDate = document.getElementById('endDate').value; // ваша максимальная дата

  try {
    const response = await fetch(`/orders?start_date=${startDate}&end_date=${endDate}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const tempData = await response.json();
    const data = tempData.data;
    console.log(data);

// Проходимся по каждому объекту JSON в массиве
const dataTable = $('#example').DataTable(); // Получаем ссылку на DataTable

data.forEach(item => {
    dataTable.row.add([
        item.date,
        item.amount,
        item.currency,
        item.type
    ]).draw(false); // Добавляем строки в DataTable и перерисовываем таблицу
});

  } catch {
    console.error('Error fetching data:');
  }
 });



