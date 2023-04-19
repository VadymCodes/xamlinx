import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent implements OnInit {

  @Input() index :number = 1;
  @Input() qa :any;
  @Output() qaChange = new EventEmitter<string>();
  @Input() disabled: boolean = false;
  faQuestionCircle = faQuestionCircle;

  constructor() { }

  ngOnInit(): void {
  }

  markAsFinal() {
    this.qa.is_final = true;
  }

}
