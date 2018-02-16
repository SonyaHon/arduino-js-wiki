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
      header.innerText = `${namespace}::${this.data.name}`;
      content.innerHTML = '';
      switch (this.data.type) {
        case 'method':
          content.appendChild(this.craftMethod(this.data));
          break;
        case 'constructor':
          content.appendChild(this.craftConstructor(this.data));
          break;
        case 'event':
          content.appendChild(this.craftEvent(this.data));
          break;
      }

    });
  }
  craftMethod(data) {
    let el = document.createElement('div');
    el.classList.add('method-wrapper');
    let fn_signature = document.createElement('div');
    fn_signature.classList.add('method-signature');
    fn_signature.innerText = data.name + '( ';
    el.appendChild(fn_signature);
    let params = [];
    Object.keys(data.params).forEach( (key) => {
      params.push({name: key, data: data.params[key]});
    });
    params.sort( (a, b) => {
      if( a.data.idx > b.data.idx) {
        return 1;
      }
      else {
        return -1;
      }
    });
    params.forEach((param) => {
      fn_signature.innerText += `${param.name}, `;
    });
    fn_signature.innerText = fn_signature.innerText.substr(0, fn_signature.innerText.length - 2) + ' )';
    let fn_description = document.createElement('div');
    fn_description.classList.add('method-description');
    fn_description.innerText = data.description;
    el.appendChild(fn_description);
    let fn_params = document.createElement('div');
    fn_params.classList.add('method-params');
    params.forEach((param) => {
      let prm_el = document.createElement('div');
      prm_el.classList.add('method-param');
      let prm_name =  document.createElement('span');
      prm_name.classList.add('method-param-name');
      prm_name.innerText = param.name.trim();
      prm_el.appendChild(prm_name);
      let prm_type = document.createElement('span');
      prm_type.classList.add('method-param-type');
      let avail = param.data['param-type'].trim().split('|');
      console.log(avail);
      let avail_str = "";
      avail.forEach((t) => {
        avail_str += `<span class="method-param-type-type">&#139;${t}&#155;</span> | `;
      });
      avail_str = avail_str.substr(0, avail_str.length - 2);
      prm_type.innerHTML =  avail_str;
      prm_el.appendChild(prm_type);
      let prm_desc = document.createElement('span');
      prm_desc.classList.add('method-param-desc');
      prm_desc.innerText = param.data['param-desc'].trim();
      prm_el.appendChild(prm_desc);
      fn_params.appendChild(prm_el);
    });
    el.appendChild(fn_params);
    let fn_example = document.createElement('div');
    fn_example.classList.add('method-example');
    fn_example.innerText = data.example;
    el.appendChild(fn_example);
    return el;
  }

  craftConstructor(data) {

  }

  craftEvent(data) {

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
  document.querySelector('.namespace-member-title').click();
});


document.getElementById('main-header').addEventListener('click', () => {
  window.location = '/';
});

document.getElementById('github').addEventListener('click', () => {
    let a = document.createElement('a');
    a.href = "https://github.com/SonyaHon/arduino_js";
    a.setAttribute('target', '_blank');
    a.click();
});