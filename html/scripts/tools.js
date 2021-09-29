function removeCp(value){
    let data = { name: value}
    fetch('./cp-remove', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
        response.json()
        window.location.reload(1);
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


function addCp(){

    let value = document.getElementById("inputName").value;
    let index = parseInt(document.getElementById("inputIndex").value);

    value = value.toUpperCase()
    let data = { 
        name: value,
        index: index
    }
    fetch('./cp-add', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
        response.json()
        window.location.reload(1);
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
