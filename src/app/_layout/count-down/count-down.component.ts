import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css']
})
export class CountDownComponent implements OnInit {

  @Input() date: Date;
  @Input() enableMiddleTitle: boolean = false;
  @Input() middleTitle;
  public timerdate;
  public now;

  constructor(
    public translate : TranslateService
  ) { 
    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  }

  ngOnInit(): void {
    this.timerdate = Math.trunc(new Date(this.date).getTime() / 1000);
    this.now = Math.trunc(new Date().getTime() / 1000);
  }

  get seconds() {
    return  (this.timerdate - this.now) % 60
  }

  get minutes() {
    return Math.trunc((this.timerdate - this.now) / 60) % 60
  }

  get hours() {
    return Math.trunc((this.timerdate - this.now) / 60 / 60) % 24
  }

  get days() {
    return Math.trunc((this.timerdate - this.now) / 60 / 60 / 24)
  }
  
}
