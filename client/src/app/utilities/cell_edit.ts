import {FormViewComponent} from "../mis-components/form-view/form-view.component";

export class CellEdit {

  static createEditableCell(td_id: string, condition: boolean, cellValue: string) {
    const comment_performance_cell = document.getElementById(td_id);
    console.log("comment_performance_cell", comment_performance_cell);
    const edit_button = document.createElement("button");
    edit_button.addEventListener("click", (e: Event) => this.cellEdit(td_id,"", condition));
    const icon_pencil = document.createElement('i');
    icon_pencil.classList.add('fas', 'fa-pencil-alt');
    const container = document.createElement('div');
    container.style.display = condition + " ? 'none' : 'block'";
    container.innerHTML = '{{ ' + cellValue + ' }}';

    edit_button.appendChild(icon_pencil);
    container.appendChild(edit_button);
    comment_performance_cell.appendChild(container);
  }

  static cellEdit(td_id:string, status: string, condition: boolean) : boolean {
    const td = document.getElementById(td_id);
    const container1 = td.firstElementChild as HTMLElement;

    if(condition) container1.style.display = 'none';
    else container1.style.display = 'block';

    if (status === "save") condition = false;
    else if (status === "cancel") {
      (document.getElementById("input-" + td_id) as HTMLTextAreaElement).value = "";
      condition = false;
    } else condition = !condition;

    if(condition) container1.style.display = 'none';
    else container1.style.display = 'block';

    if (document.getElementById("edit-cell-" + td_id) === null) {

      const saveButton = document.createElement("button");
      saveButton.classList.add('btn', 'btn-link');
      saveButton.addEventListener("click", (e: Event) => this.cellEdit(td_id, "save", condition));

      const cancelButton = document.createElement("button");
      cancelButton.classList.add('btn', 'btn-link');
      cancelButton.addEventListener("click", (e: Event) => this.cellEdit(td_id, "cancel", condition));

      const icon_check = document.createElement('i');
      icon_check.classList.add('fas', 'fa-check');
      const icon_times = document.createElement('i');
      icon_times.classList.add('fas', 'fa-times');

      const container = document.createElement('div');
      container.id = "edit-cell-" + td_id;

      const input = document.createElement('input');
      input.type = 'text';
      input.classList.add('form-control', 'in-line-cell');
      input.id = "input-"+td_id;

      saveButton.appendChild(icon_check);
      cancelButton.appendChild(icon_times);
      container.appendChild(input);
      container.appendChild(saveButton);
      container.appendChild(cancelButton);
      td.appendChild(container);
    } else {
      const container2 = document.getElementById("edit-cell-" + td_id);
      if(condition) container2.style.display = 'block';
      else container2.style.display = 'none';

      if(condition) container1.style.display = 'none';
      else container1.style.display = 'block';
    }

    return condition;
  }
}
