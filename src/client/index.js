const namespace = document.getElementById('namespaces');
const information = document.getElementById('information');

function GetRequest(url, clb) {
  let xmlReq = new XMLHttpRequest();
  xmlReq.onreadystatechange = () => {
    if(xmlReq.readyState == 4 && xmlReq.status == 200) {
      clb(xmlReq.response);
    }
  };
  xmlReq.open("GET", url, true);
  xmlReq.send(null);
}

//helps
class NamespaceMember {
  constructor(name, data) {
    this.el = document.createElement('div');
    this.el.classList.add('namespace-member');
    this.category_title = document.createElement('div');
    this.category_title.classList.add('namespace-member-title');
    this.el.appendChild(this.category_title);
    this.category_title.innerHTML = `<span>${name}</span>`;
    if(data.length > 1) {
      // todo: craft shit from data
    }

    this.category_title.addEventListener('click', () => {
      console.log('YAAY');
    });

  }
}
class Namespaces {
  constructor(data) {
    this.data = data;
    this.el = document.createElement('div');
    this.el.classList.add('namespaces-main');
    this.craftDirs();
  }
  craftDirs() {
    let keys = Object.keys(this.data);
    keys.sort();
    keys.forEach( (elem) =>  {
      this.el.appendChild((new NamespaceMember(elem.substr(3),this.data[elem])).el);
    });
  }
}


// load namespaces and their shit
GetRequest('/namespaces', (data) => {
  namespace.appendChild((new Namespaces(JSON.parse(data))).el);
});

