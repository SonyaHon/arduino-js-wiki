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

class NamespaceField {
  constructor(data, namespace) {
    this.data = data;
    this.namespace = namespace;
    this.el = document.createElement('div');
    this.el.classList.add('namespace-field');
    this.el.innerText = data.name;
    this.el.addEventListener('click', () => {
      let header = document.getElementById('method-name');
      let content = document.getElementById('content');

      // TODO: Make data appear

    });
  }
}
class NamespaceMember {
  constructor(name, data) {
    this.el = document.createElement('div');
    this.el.classList.add('namespace-member');
    this.category_title = document.createElement('div');
    this.category_title.classList.add('namespace-member-title');
    this.el.appendChild(this.category_title);
    this.category_title.innerHTML = `<span>${name}</span>`;
    if(data.length > 1) {
      this.category_fields = document.createElement('div');
      this.category_fields.classList.add('namespace-member-fields');
      this.el.appendChild(this.category_fields);

      data.forEach( (file) => {
        if(file !== 'index.ardoc') {
          GetRequest(`/namespace?name=${name}&file=${file}`, (data) => {
              this.category_fields.appendChild((new NamespaceField(JSON.parse(data), name)).el);
          });
        }
      });

    }
    this.category_title.addEventListener('click', () => {
      GetRequest(`/namespace?name=${name}&file=index.ardoc`, (data) => {
        document.getElementById('method-name').style.display = 'none';
        document.getElementById('content').innerHTML = data;
      })
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

