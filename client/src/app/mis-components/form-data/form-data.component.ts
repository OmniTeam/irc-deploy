import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormService} from '../../services/form.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SelectionType} from '@swimlane/ngx-datatable';
import {ModalDismissReasons, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReplacePipe} from '../../replace-pipe';
import {FormGroup} from '@angular/forms';
import * as d3 from 'd3';
import * as dc from 'dc';
import * as crossfilter from 'crossfilter2/crossfilter';
import * as d3Tip from 'd3-tip';
import * as L from 'leaflet';
import * as $ from 'jquery';

const iconRetinaUrl = '../../../assets/leaflet/marker-icon-2x.png';
const iconUrl = '../../../assets/leaflet/marker-icon.png';
const shadowUrl = '../../../assets/leaflet/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-form-data',
  templateUrl: './form-data.component.html',
  styleUrls: ['./form-data.component.css']
})
export class FormDataComponent implements OnInit, AfterViewInit {
  $: any;
  model: NgbDateStruct;
  entries = 5;
  selected: any[] = [];
  activeRow: any;
  rows: Object[];
  columns: any;
  SelectionType = SelectionType;
  closeModal: string;
  formName: String;
  formGroup: FormGroup;
  userGroups = [
    {
      id: '745j4u45u6564',
      name: 'Acila Ent Ltd'
    },
    {
      id: '745j4u45u6947775678898564',
      name: 'EASTERN Ent Ltd'
    },
    {
      id: '745j4u45u57794564',
      name: 'IMCOS'
    }
  ];
  users = [
    {
      id: '745j4u45u694564',
      name: 'Bryan'
    },
    {
      id: '745j4u45u6947775678898564',
      name: 'Angel'
    },
    {
      id: '745j4u45u57794564',
      name: 'Victor'
    }
  ];
  selectedUserGroup: any;
  selectedUser: any;
  numberOfRecords: any;
  numberOfQuestions: any;
  coordinates: any[] = [];
  private map;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formService: FormService,
              private modalService: NgbModal,
              private http: HttpClient) {
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    const val = $event.target.value;
    this.rows = this.rows.filter(function (d) {
      for (const key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getFormData(params.formtable);
    });
  }

  getFormData(formtable: String) {
    const params = new HttpParams()
      .set('formtable', `${formtable}`);

    this.formService.getFormData(params).subscribe((data) => {
      this.formName = new ReplacePipe().transform(data.form['displayName'], '_', ' ');
      this.rows = data.resultList;
      this.columns = this.columnMappings(data.headerList);
      this.numberOfRecords = data.resultListCount;
      this.numberOfQuestions = data.numberOfQuestions;
      if (data['gpsCoordinates'].length === 0) {
        document.getElementById("map_div").style.display = "none";
      } else {
        document.getElementById("map_div").style.display = "block";
        this.coordinates = data['gpsCoordinates'];
        if (this.coordinates.length > 0) {
          this.makeMarkers(this.map, this.coordinates, formtable);
        }
      }
    }, error => console.log(error));
  }

  ngAfterViewInit(): void {
    this.http.get('assets/data/users.csv', {responseType: 'text'}).subscribe(data => {
      const formData = d3.csvParse(data);
      this.initCharts(formData);
    });
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [1.3733, 32.2903],
      zoom: 7
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 7,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }

  private initCharts(formData): void {
    const dateFormat2 = d3.utcParse('%Y-%m-%d %H:%M:%S.%L');
    const dateFormat = d3.timeFormat('%a %e %b %Y');
    const numberFormat = d3.format('.2f');
    const user_bar_chart = dc.barChart('#form-data-bar-chart');
    const time_chart = dc.lineChart('#form-data-line-chart');
    const barWidth = document.getElementById('form-data-bar-chart').offsetWidth;
    const lineWidth = document.getElementById('form-data-line-chart').offsetWidth;

    formData.forEach(d => {
      d.date = dateFormat2(d.date);
      d.count = +d.count;
    });
    const ndx = crossfilter(formData);
    const all = ndx.groupAll();
    const user_dim = ndx.dimension(d => {
      return d.user;
    });
    const count_per_user = this.remove_empty_bins(user_dim.group().reduceSum(d => {
      return d.count;
    }));
    const date_dim = ndx.dimension(d => {
      return d3.timeDay(d.date);
    });
    const date_group = this.remove_empty_bins(date_dim.group().reduceSum(d => {
      return d.count;
    }));


    const xrange = <[Date, Date]>d3.extent(formData, (d: any) => {
      return d.date;
    });
    const startDate = d3.timeDay.offset(xrange[0], -2);
    const endDate = d3.timeDay.offset(xrange[1], +2);
    const InitialBrush = [startDate, endDate];

    user_bar_chart
      .width(barWidth)
      .height(250)
      .dimension(user_dim)
      .group(count_per_user)
      .margins({top: 10, right: 0, bottom: 40, left: 50})
      .barPadding(0.1)
      .outerPadding(0.05)
      .elasticX(true)
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .elasticX(true)
      .xAxisLabel('User')
      .yAxisLabel('Number of Records')
      .alwaysUseRounding(true)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .elasticY(true)
      .controlsUseVisibility(true)
      .title(function () {
        return '';
      })
      .filterPrinter((filters) => {
        const filter = filters[0];
        let s = '';
        s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
        return s;
      });

    user_bar_chart.xAxis().tickFormat((v: any) => {
      const length = count_per_user.all().length;
      return length < 70 ? v : '';
    });
    user_bar_chart.renderlet((chart) => {
      const length = count_per_user.all().length;
      if (length > 10) {
        chart.selectAll('g.x text')
          .attr('dx', '-20')
          .attr('dy', '0')
          .attr('transform', 'rotate(-45)')
          .attr('text-anchor', 'start')
          .attr('color', 'black');
      }
    });

    user_bar_chart.on('renderlet', (chart) => {
      chart.selectAll('g text.y-axis-label')
        .attr('dx', '5')
        .attr('dy', '7')
        .attr('color', 'black');
      chart.selectAll('g text.x-axis-label')
        .attr('dx', '-12')
        .attr('dy', '10')
        .attr('color', 'black');
    });

    time_chart
      .width(lineWidth)
      .height(200)
      .renderArea(true)
      .dimension(date_dim)
      .group(date_group)
      .brushOn(false)
      .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
      .x(d3.scaleTime().domain(InitialBrush))
      .round(d3.timeDay.round)
      .xUnits(d3.timeDay.range)
      .margins({left: 100, top: 10, right: 0, bottom: 20})
      .renderHorizontalGridLines(true)
      .renderDataPoints({radius: 5, fillOpacity: 0.8, strokeOpacity: 0.0})
      .elasticY(true)
      .elasticX(true)
      .clipPadding(10)
      .brushOn(false)
      .title(() => {
        return '';
      })
      .clipPadding(10)
      .filterPrinter((filters) => {
        const dateStart = new Date(filters[0][0]);
        const dateEnd = new Date(filters[0][1]);
        const formatTime = d3.timeFormat('%d/%b/%Y %H:%M:%S');
        return formatTime(dateStart) +
          ' --- ' + formatTime(dateEnd);
      });
    time_chart.yAxis();
    time_chart.renderlet((chart) => {
      const length = date_group.all().length;
      if (length > 5) {
        chart.selectAll('g.x text')
          .attr('dx', '-20')
          .attr('dy', '0')
          .attr('transform', 'rotate(-45)')
          .attr('text-anchor', 'start')
          .attr('color', 'black');
      }
    });

    const userBarTip = d3Tip.default()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((d) => {
        return '<div style=" background: #03A9F4; border-radius: 8px; padding: 12px; font-weight: bold; color: cornsilk;"><span> User : ' + d.target.__data__.x + '</span> <br /> <span> Number of Records :  ' + d.target.__data__.y + '</span></div>';
      });
    const timeTip = d3Tip.default()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((d) => {
        return '<div style=" background: #03A9F4; border-radius: 8px; padding: 12px; font-weight: bold; color: cornsilk;"><span> On ' + dateFormat(d.target.__data__.x) + '</span> <br /> <span> Number of Records : ' + d.target.__data__.y + '</span></div>';
      });

    user_bar_chart.on('pretransition', function (chart) {
      chart.selectAll('.bar')
        .call(userBarTip)
        .on('mouseover', userBarTip.show)
        .on('mouseout', userBarTip.hide);
    });
    time_chart.on('pretransition', function (chart) {
      chart.selectAll('.dot')
        .call(timeTip)
        .on('mouseover', timeTip.show)
        .on('mouseout', timeTip.hide);
    });
    dc.renderAll();
  }

  columnMappings(array) {
    const columns = [];
    for (const column of array) {
      const columnProperties = {};
      columnProperties['prop'] = column['field'];
      columnProperties['name'] = column['displayName'];
      columns.push(columnProperties);
    }
    return columns;
  }

  viewRecord(modalDom, valObj: any) {
    this.modalService.open(modalDom, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeModal = `Closed with: ${result}`;
      console.log(this.closeModal);
    }, (reason) => {
      this.closeModal = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeModal);
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  fetchFilteredData() {
    const filters = this.formGroup.value;
    console.log(filters);
  }

  remove_empty_bins(source_group) {
    return {
      all: function () {
        return source_group.all().filter(function (d) {
          return d.value !== 0;
        });
      }
    };
  }

  makeMarkers(map: L.map, coordinates: any, formtable: any): void {
    for (const c of coordinates) {
      const lon = parseFloat(c.point[0]);
      const lat = parseFloat(c.point[1]);
      const marker = L.marker([lat, lon]);
      marker.bindPopup('Loading....');
      marker.on('click', (e) => {
        let popup = e.target.getPopup();
        this.makePopUp(c['__id'], formtable, popup);
      });
      marker.addTo(map);
    }
  }

  makePopUp(id: any, formtable: any, popup: any): void {
    const params = new HttpParams()
      .set('id', `${id}`)
      .set('formtable', `${formtable}`);

    this.formService.getPointDetails(params).subscribe((data) => {
      if (Object.keys(data).length > 0) {
        let pointDetails = data;
        let html = "<table style='border-collapse: collapse; text-align: center !important; width: 100%;'>";
        for (const [k, v] of Object.entries(pointDetails)) {
          let value = (v === null) ? 'None' : v.toString();
          html = html + "<tr><td style='text-align:left;font-size:14px; padding: 8px; border: 1px solid #dddddd;'>" + k.replace(/_/g, " ")
            + "</td><td style='text-align:left;font-size:14px; padding: 8px; border: 1px solid #dddddd;'>" + value.replace(/_/g, " ") + "</td> </tr>";
        }
        html = html + "</table>";
        popup.setContent(html);
        popup.update();
      }
    }, error => console.log(error));
  }
}
