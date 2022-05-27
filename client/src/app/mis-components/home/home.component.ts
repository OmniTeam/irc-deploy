import {Component, OnInit} from '@angular/core';
import {TaskListService} from "../../services/task-list.service";
import {OngoingTask} from "../../models/ongoing-task";
import {ActivatedRoute, Router} from "@angular/router";
import {DateAgoPipe} from "../../pipes/date-ago.pipe";
import {ProgramPartnersService} from "../../services/program-partners.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskListService: TaskListService,
    private programPartnersService: ProgramPartnersService,
  ) {
  }

  entries: number = 10;

  rows: OngoingTask[];
  temp: OngoingTask[];
  reporting: OngoingTask[];
  grantProcess: OngoingTask[];
  isReporting: boolean;
  isGrantProcess: boolean;

  filterCounter: { filter: string, count: number }[] = []
  filters = [
    {name: '0 to 1 Week'},
    {name: '1 to 2 Week'},
    {name: '3 to 4 Week'},
    {name: 'More than 4 Weeks'},
    {name: 'All'},
  ];
  taskListRows: OngoingTask[];

  ngOnInit(): void {
    this.reloadTable(true);
    //load filter counts
    this.filters.forEach((filter) => {
      this.setFilters(filter, true)
    })
  }

  switchRowsData(type: string) {
    this.isReporting = false;
    this.isGrantProcess = false;
    switch (type) {
      case 'reporting':
        this.isReporting = true;
        this.rows = this.reporting;
        this.temp = [...this.reporting];
        break;
      case 'grant_process':
        this.isGrantProcess = true;
        this.rows = this.grantProcess;
        this.temp = [...this.grantProcess];
        break;
    }
  }

  entriesChange($event) {
    this.entries = $event.target.value;
    this.reloadTable();
  }

  reloadTable(firstTime?: boolean) {
    this.taskListService.getTaskList().subscribe(data => {
      let results = []
      let results1 = [];
      let results2 = [];

      if (data != null) {
        data.forEach((item) => {
          results.push(this.getRow(item.id,  item.taskDefinitionKey, item.processDefKey, item.startDate, item.program))
          if (item.processDefKey == "CRVPF_REPORTING") results1.push(this.getRow(item.id, item.taskDefinitionKey, item.processDefKey, item.startDate, item.partnerName))
          if (item.processDefKey == "GRANT_PROCESS") results2.push(this.getRow(item.id,  item.taskDefinitionKey, item.processDefKey, item.startDate, item.programName))
        });
      }
      this.taskListRows = results;
      this.reporting = results1;
      this.grantProcess = results2;

      if (firstTime == true) this.switchRowsData('reporting');
    });
  }

  getRow(id, taskName, type, dateAssigned, taskCase): OngoingTask {
    let taskAge = new DateAgoPipe().transform(dateAssigned)
    let filterCategory = this.setFilterCategory(taskAge)
    return (
      {
        id: id,
        task_name: taskName,
        task_case: taskCase,
        task_type: type,
        date_assigned: dateAssigned,
        task_age: taskAge,
        filter_category: filterCategory
      }
    );
  }

  getPartner(id): any {
    this.programPartnersService.getCurrentProgramPartner(id).subscribe((results: any) => {
      if (results !== null && results !== undefined) {
        return results;
      }
    });
    return null
  }

  onChangeSearch(event) {
    let val = event.target.value.toLowerCase();
    // update the rows
    this.rows = this.temp.filter(function (d) {
      for (const key in d) {
        if (d[key]?.toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSearch(event) {
    this.reloadTable();
  }

  openForm(processDefKey: any, row) {
    switch (processDefKey) {
      case 'CRVPF_REPORTING':
        this.router.navigate(['/reportForm/' + row.id + '/' + false]);
        break;
      case 'GRANT_PROCESS':
        this.router.navigate(['/grantProcess/' + row.id + '/' + false]);
        break;
    }
  }

  setFilterCategory(taskAge: string) {
    let filterCategory: any
    if (taskAge.includes('week')) {
      filterCategory = {period: 'week', duration: taskAge.charAt(0)}
    } else if (taskAge.includes('month')) {
      filterCategory = {period: 'month', duration: taskAge.charAt(0)}
    } else if (taskAge.includes('year')) {
      filterCategory = {period: 'year', duration: taskAge.charAt(0)}
    }
    return filterCategory
  }

  setFilters(filter, firstTime?: boolean) {
    this.taskListService.getTaskList().subscribe(data => {
      let results = []
      let rts = []
      if (data != null) {
        data.forEach((item) => {
          let staff = this.getPartner(item.staffId);
          rts.push(this.getRow(item.id, item.taskDefinitionKey, item.processDefKey, item.startDate, item.case))
        });
        rts.forEach((task) => {
          if (task.filter_category != undefined) {
            if (filter.name == 'More than 4 Weeks') {
              if (task.filter_category.period == 'month' || task.filter_category.period == 'year') results.push(task)
              this.filterCount(filter, results.length)
            } else if (filter.name == '0 to 1 Week') {
              if (task.filter_category.period == 'week' && task.filter_category.duration <= 1) {
                results.push(task)
              } else if (task.filter_category.period == 'day') results.push(task)
              this.filterCount(filter, results.length)
            } else if (filter.name == '1 to 2 Week') {
              if (task.filter_category.period == 'week' && task.filter_category.duration >= 1 && task.filter_category.duration <= 2) {
                results.push(task)
              }
              this.filterCount(filter, results.length)
            } else if (filter.name == '3 to 4 Week') {
              if (task.filter_category.period == 'week' && task.filter_category.duration >= 3 && task.filter_category.duration <= 4) {
                results.push(task)
              }
              this.filterCount(filter, results.length)
            }
          }
        })
        if (firstTime != true) this.taskListRows = results;
      }
    });

    if (filter.name == 'All') {
      this.reloadTable();
    }
  }

  filterCount(filter, count: number) {
    if (this.filterCounter.some(x => x.filter === filter.name)) {
      this.filterCounter.forEach((item) => {
        if (item.filter == filter.name) item.count = count
      })
    } else this.filterCounter.push({filter: filter.name, count: count})
  }

  getNumberOfRecordsForFilter(filterName): number {
    let number = 0
    this.filterCounter.forEach((item) => {
      if (item.filter == filterName) number = item.count
    })
    if (filterName == 'All') {
      number = this.taskListRows?.length
    }
    return number
  }
}
