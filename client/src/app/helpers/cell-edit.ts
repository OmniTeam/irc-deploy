export class CellEdit {
  condition: boolean;

  createEditableCell(saveCellValue: (newValue: string, key: string, row_id, row?: any) => void,
                     rowId: string,
                     key: string,
                     oldValue,
                     type?: string,): HTMLDivElement {
    const icon_pencil = document.createElement('i');
    icon_pencil.classList.add('fas', 'fa-pencil-alt');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-link');
    button.addEventListener('click', (e: Event) => {
      new CellEdit().edit(rowId, rowId, oldValue, key, saveCellValue, type);
    });
    button.appendChild(icon_pencil);

    const div = document.createElement('div');
    div.appendChild(button);
    return div;
  }

  edit(row_id,
       td_id: string,
       oldValue: string,
       key: string,
       save: (newValue: string, key: string, row_id, row?: any) => void,
       type?: string,
       status?: string,
       selectList?:[]) {
    const td = document.getElementById(td_id);
    const container1 = td.firstElementChild as HTMLElement;

    if (this.condition) container1.style.display = 'none';
    else container1.style.display = 'block';

    if (status === "save") {
      let newValue;
      if (type == 'select') {
        newValue = (document.getElementById("input-" + td_id) as HTMLSelectElement).value;
      } else  {
        newValue = (document.getElementById("input-" + td_id) as HTMLTextAreaElement).value;
      }
      save(newValue, key, row_id);
      this.condition = false;
    } else if (status === "cancel") {
      (document.getElementById("input-" + td_id) as HTMLTextAreaElement).value = oldValue;
      this.condition = false;
    } else this.condition = !this.condition;

    if (this.condition) container1.style.display = 'none';
    else container1.style.display = 'block';

    if (this.isNotEditing(td_id)) {

      const saveButton = document.createElement("button");
      saveButton.classList.add('btn', 'btn-link');
      saveButton.addEventListener("click", (e: Event) => this.edit(row_id, td_id, oldValue, key, save, undefined, "save"));
      saveButton.id = "save_button" + td_id;

      const cancelButton = document.createElement("button");
      cancelButton.classList.add('btn', 'btn-link');
      cancelButton.addEventListener("click", (e: Event) => this.edit(row_id, td_id, oldValue, key, save, undefined, "cancel"));
      cancelButton.id = "cancel_button" + td_id;

      const icon_check = document.createElement('i');
      icon_check.classList.add('fas', 'fa-check');
      const icon_times = document.createElement('i');
      icon_times.classList.add('fas', 'fa-times');

      const container = document.createElement('div');
      container.id = "edit-cell-" + td_id;

      let input;

      if (type == 'select') {
        if(selectList==undefined) { console.log('Error: ','select has no data'); return; }
        container.classList.add('form-group', 'text-center');
        container.style.margin = '0 0 30px 30px';
        container.style.width = '60%';
        input = document.createElement('select');
        input.classList.add('form-control','form-control-sm');
        input.id = "input-" + td_id;
        input.insertAdjacentHTML('afterbegin', "<option selected>"+oldValue+"</option>\n" + this.getOptionsForSelect(selectList, oldValue));
      } else {
        if (type == 'number') {
          input = document.createElement('input');
          input.type = 'number';
        } else {
          input = document.createElement('textarea');
          input.setAttribute('rows', '1');
        }
        input.classList.add('form-control', 'in-line-cell');
        input.id = "input-" + td_id;
        input.setAttribute('value', oldValue);
        input.setAttribute('name', key);

        input.style.maxWidth = '400px';
      }

      saveButton.appendChild(icon_check);
      cancelButton.appendChild(icon_times);
      container.appendChild(input);
      container.appendChild(saveButton);
      container.appendChild(cancelButton);

      td.style.display = 'flex';
      td.style.justifyContent = 'center';
      td.appendChild(container);
    } else {
      const container2 = document.getElementById("edit-cell-" + td_id);
      if (this.condition) container2.style.display = 'flex';
      else container2.style.display = 'none';

      if (this.condition) container1.style.display = 'none';
      else container1.style.display = 'block';
    }
  }

  getOptionsForSelect(data, oldValue): string {
    console.log('data', data);
    let htmlString = "";
    data.forEach(function (row) {
      if(row.name!==oldValue) htmlString += '<option value="' + row.name + '">\n' + row.name + '</option>\n';
    });
    return htmlString;
  }

  getInput(td_id: string) {
    return document.getElementById("input-" + td_id);
  }

  saveButton(td_id: string) {
    return document.getElementById("save_button" + td_id);
  }

  cancelButton(td_id: string) {
    return document.getElementById("cancel_button" + td_id);
  }

  isEditing(td_id: string) {
    return document.getElementById("edit-cell-" + td_id) !== null;
  }

  isNotEditing(td_id: string) {
    return document.getElementById("edit-cell-" + td_id) === null;
  }
}

export abstract class OnUpdateCell {
  abstract saveCellValue = (value: string, key: string, rowId, row?: any) => void {};
}


