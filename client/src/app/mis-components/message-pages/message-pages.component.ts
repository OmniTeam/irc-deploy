import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-message-pages',
  templateUrl: './message-pages.component.html',
  styleUrls: ['./message-pages.component.css']
})
export class MessagePagesComponent implements OnInit {
  success: boolean;
  failure: boolean;
  @Input() title: string;
  @Input() message: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(p => {
        this.success = p['type'] == 'success';
        this.failure = p['type'] == 'failure';
      })
  }

}
