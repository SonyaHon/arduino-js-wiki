const fs = require('fs');
const marked = require('marked');
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
});
const path = require('path');
const pathToFolder = path.join(__dirname, '/ARDOC');

class Parser {
  constructor(){}
  parse(filename) {

    let file = fs.readFileSync(filename, 'utf8');
    if(file) {
      let file_type = file.match(/@[^\r\n]*\r\n|@[^\r\n]*\r|@[^\r\n]*\n/)[0];
      if(file_type === '@article\r\n' || file_type === '@article\n' || file_type === '@article\r') {
        return marked.parse(file.substr(file_type.length));
      }
      else {
        let final_obj = {params: {}};
        file = file.substr(file_type.length);
        // get type
        final_obj.type = file.match(/@type: ?([^\n\r]*)/)[1];
        final_obj.name = file.match(/@name: ?([^\n\r]*)/)[1];

        let idx_start = file.match(/@params/).index + '@params'.length;
        let idx_end = file.match(/@\/params/).index;
        let params = file.substr(idx_start, idx_end - 41);

        // ADD NEW PARAM PROPS HERE
        params = params.match(/@param-name: ?([^\r\n]*)|@param-type: ?([^\r\n]*)|@param-desc: ?(("([^"]*)")|([^\r\n]*))|@param-exp: ?(\/\*[^]*\*\/)/g);

        let current_param = null;
        let current_param_idx = -1;
        for(let i = 0; i < params.length; i++) {

          let parsed_param = params[i].match(/@(.*):([^]*)/);
          if(parsed_param[1] === 'param-name') {
            current_param = parsed_param[2];
            current_param_idx += 1;
            final_obj.params[current_param] = {
              idx: current_param_idx
            }
          }
          else {
            final_obj.params[current_param][parsed_param[1]] = parsed_param[2];
          }
        }

        final_obj.description = file.match(/@desc: ?(("([^"]*)")|([^\r\n]*))/)[1];
        final_obj.example = file.match(/@example: ?\/\*([^]*)\*\//)[1];
        //  ADD NEW PROPS HERE

        console.log(final_obj);
        return final_obj;
      }
    }
    else {
      return 'code404';
    }

  }
}

module.exports = new Parser();