import { Component, OnInit } from '@angular/core';
import { MessagingService } from 'src/app/shared/messaging.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(    private messagingService: MessagingService ) { 
    this.messagingService.requestPermission();
  }
  ngOnInit(): void {
  }

}
