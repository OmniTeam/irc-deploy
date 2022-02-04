import {FormViewComponent} from "../mis-components/form-view/form-view.component";

export class CellEdit {
  condition: boolean;

  createEditableCell(td_id: string, condition: boolean, cellValue: string) {
    const comment_performance_cell = document.getElementById(td_id);
    console.log("comment_performance_cell", comment_performance_cell);
    const edit_button = document.createElement("button");
    edit_button.addEventListener("click", (e: Event) => this.cellEdit("", td_id, "", "", ""));
    const icon_pencil = document.createElement('i');
    icon_pencil.classList.add('fas', 'fa-pencil-alt');
    const container = document.createElement('div');
    container.style.display = condition + " ? 'none' : 'block'";
    container.innerHTML = '{{ ' + cellValue + ' }}';

    edit_button.appendChild(icon_pencil);
    container.appendChild(edit_button);
    comment_performance_cell.appendChild(container);
  }

  cellEdit(row_id, td_id: string, status: string, oldValue: string, name: string) {
    const td = document.getElementById(td_id);
    const container1 = td.firstElementChild as HTMLElement;
    let newValue;

    if (this.condition) container1.style.display = 'none';
    else container1.style.display = 'block';

    if (status === "save") {
      newValue = (document.getElementById("input-" + td_id) as HTMLTextAreaElement).value
      FormViewComponent.saveCellValues(newValue, name, row_id);
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
      saveButton.addEventListener("click", (e: Event) => this.cellEdit(row_id, td_id, "save", oldValue, name));
      saveButton.id = "save_button" + td_id;

      const cancelButton = document.createElement("button");
      cancelButton.classList.add('btn', 'btn-link');
      cancelButton.addEventListener("click", (e: Event) => this.cellEdit(row_id, td_id, "cancel", oldValue, name));
      cancelButton.id = "cancel_button" + td_id;

      const icon_check = document.createElement('i');
      icon_check.classList.add('fas', 'fa-check');
      const icon_times = document.createElement('i');
      icon_times.classList.add('fas', 'fa-times');

      const container = document.createElement('div');
      container.id = "edit-cell-" + td_id;

      const input = document.createElement('input');
      input.type = 'text';
      input.classList.add('form-control', 'in-line-cell');
      input.setAttribute('placeholder', 'edit');
      input.id = "input-" + td_id;
      input.setAttribute('value', oldValue);
      input.setAttribute('name', name);

      saveButton.appendChild(icon_check);
      cancelButton.appendChild(icon_times);
      container.appendChild(input);
      container.appendChild(saveButton);
      container.appendChild(cancelButton);
      td.appendChild(container);
    } else {
      const container2 = document.getElementById("edit-cell-" + td_id);
      if (this.condition) container2.style.display = 'block';
      else container2.style.display = 'none';

      if (this.condition) container1.style.display = 'none';
      else container1.style.display = 'block';
    }
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

export abstract class CellEditor {
  abstract saveCellValues(newValue:string, type:string, row_id) : void;
}


