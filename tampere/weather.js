//---------------------------------NavigationHandler---------------------------------//
const MAIN_DATA_SOURCE = 'http://webapi19sa-1.course.tamk.cloud/v1/weather/';
let dataSource = "";
let currentView = "";
let button = 0;
let currentType = "";
let getAvg = false;
let rows = null;
let order = false;

function getAll(){
  getAvg = false;
  dataSource = MAIN_DATA_SOURCE;
  currentView = "all";
  button = 0;
  rows = 30;
  getData();
}

function getType(type, buttonNumber){
  getAvg = false;
  dataSource = MAIN_DATA_SOURCE + type;
  currentView = "type";
  currentType = type;
  button = (buttonNumber)? buttonNumber: button;
  rows = 20;
  getData();
}

function getOther(type, buttonNumber){
  getAvg = false;
  dataSource = MAIN_DATA_SOURCE;
  currentView = "other";
  currentType = type;
  button = (buttonNumber)? buttonNumber: button;
  rows = 25;
  getData();
}

function getTime(avg){
  if(avg){
    dataSource = MAIN_DATA_SOURCE + `${currentType}/${avg}/`;
    getAvg = true;
    getData();
  }
  else{
    (currentView == "type")? getType(currentType) : getOther(currentType);
  }
  
}

function sortData(){
  order = !order;
  getData();

  document.getElementById("sorticon1").style.display = (order)? "inline": "none";
  document.getElementById("sorticon2").style.display = (order)? "none": "inline";
}

//---------------------------------GetData---------------------------------//

function getData() {
  
  fetch(dataSource).then(response => response.json())
                    .then(data => filterData(data))
                    .then(data => {

                      data = (order)?data.reverse():data;

                      const e = document.getElementById("data-container");
                      e.innerHTML = dataToHtmlRepresentation( data );

                    })
                    .then(handleClicked())
                    .catch(error => {console.error(error); alert(error);});
}

//---------------------------------FilterData---------------------------------//

function filterData(dataObjects){
  if(currentView == 'other' && !getAvg){
    dataObjects = dataObjects.filter((type) => (Object.keys(type.data)[0]) === currentType);
  }

  const data = [];
  const l = dataObjects.length;
  
  if (getAvg){
    for (let i = 0; i < l; i++) {
      let dataObject = dataObjects[i];
      let type = Object.keys(dataObject)[1];
      let time = new Date(dataObject.date_time);
      
      const tdata = {
        'date': time.toLocaleDateString("en-FI"),
        'time': time.toLocaleTimeString("en-FI"),
        'type': type.split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '),
        'value': dataObject[type],
      };
      data.push(tdata);
    }
    data.reverse();
  }
  else if(currentView=="type"){
    for (let i = 0; i < l; i++) {
      let dataObject = dataObjects[i];
      let type = Object.keys(dataObject)[2];
      let time = new Date(dataObject.date_time);
      
      const tdata = {
        'date': time.toLocaleDateString("en-FI"),
        'time': time.toLocaleTimeString("en-FI"),
        'type': type.split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '),
        'value': dataObject[type],
      };
      data.push(tdata);
    }
    data.reverse();
  }
  else{
    for (let i = 0; i < rows && i < l; i++) {
      let dataObject = dataObjects[i];
      let type = Object.keys(dataObject.data)[0];
      let time = new Date(dataObject.date_time);
  
      const tdata = {
        'date': time.toLocaleDateString("en-FI"),
        'time': time.toLocaleTimeString("en-FI"),
        'type': type.split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '),
        'value': dataObject.data[type],
      };
      data.push(tdata);
    }
  }

  return data;
}

//---------------------------------DataTable---------------------------------//

function dataToHtmlRepresentation(dataObjects) {
  let html = '<table><tr><th>Row No.</th><th>Date</th><th>Time</th><th>Type</th><th>Value</th></tr>';
  const l = dataObjects.length;

  //chart variables
  const xs = [];
  const ys = [];

  //distribute values
  for (let i = 0; i < l; i++) {
    let dataObject = dataObjects[i];
    
    //get chart values
    xs.unshift(dataObject.time);
    ys.unshift(dataObject.value);

    //get html table values
    html += `<tr>
      <td>${i+1}</td>
      <td>${dataObject.date}</td>
      <td>${dataObject.time}</td>
      <td class="type">${dataObject.type}</td>
      <td class="value">${dataObject.value}</td>
      </tr>
    `;
  }
  //Create chart
  if(currentType != "all"){
    chart( xs, ys, (dataObjects[0].type) );
  }

  html += '</table>';
  return html;
}

//---------------------------------Chart---------------------------------//

let myChart = null;

function chart(xs,ys,type){

  if(myChart){
    myChart.destroy();
  }

  let ctx = document.getElementById('myChart');

  myChart = new Chart(ctx, {
    type: (currentView == "other")? "line":"bar",
    data:{
      labels: xs,
      datasets: [
        {
        label: type,
        data: ys,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        }
      ]
    },
    option:{}
  });
}

//---------------------------------HandleClick---------------------------------//

//Display
function handleClicked(view, buttonNumber) {
  if(view){
    currentView = view;
    button = buttonNumber;
  }
   
  let weather = document.getElementById("data-container");
  let info = document.getElementById("info");
  let showChart = document.getElementById("chart");
  let dropdown = document.getElementsByClassName("dropdown");
  let sort = document.getElementById("sortbtn");

  weather.style.display = (currentView != "info")? "block": "none";
  info.style.display = (currentView == "info")? "block": "none";
  showChart.style.display = (currentView =="info" || currentView == "all")? "none": "block";
  dropdown[0].style.display = (currentView == "other")? "flex": "none";  
  dropdown[1].style.display = (currentView == "type" || currentView == "other")? "flex": "none";
  sort.style.display = (currentView == "info")? "none": "flex";

  //highlight current view
  let tablinks = document.getElementsByClassName("tablink");
  for(let i = 0; i < tablinks.length; i++){
    tablinks[i].style.backgroundColor = "";
  }
  tablinks[button].style.backgroundColor = "#599cbe";
}


//---------------------------------HandleDropdown---------------------------------//


let dropdown = document.getElementsByClassName("dropdown-content");

function hover(btn){
  dropdown[0].style.display = (btn == 1)? "block": "none";
  dropdown[1].style.display = (btn == 2)? "block": "none";
};

document.addEventListener("click", e => {
  if (e.target.matches("li")){
    let dropdown = document.getElementsByClassName("dropdown-content");
    dropdown[0].style.display =  "none";
    dropdown[1].style.display =  "none"; 
  }
});