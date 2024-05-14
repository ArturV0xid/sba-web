const fileLoader = document.getElementById('send_data');

fileLoader.addEventListener('click', async () =>{
    const file = document.getElementById('fileToUpload').files[0];
    let formData = new FormData();
    formData.append('file', file);
    const response = await fetch("/orders", {
        method: 'POST',
        body: formData
    })
    if (response.ok) {
        console.log('+++');
    }
    else{
        console.error('---');
    }
});

new DataTable('#example', {
    paging: false,
    scrollCollapse: true,
    scrollY: '50vh'
});

const dateButton  = document.getElementById('dateButton')
dateButton.addEventListener('click', async () => {

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



