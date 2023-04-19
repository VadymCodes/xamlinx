import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit {
  private _radioOffImage = 'radio-off.png';
  private _radioOnImage = 'radio-on.png';

  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() id: string = '';
  @Input() value: any = {} as any;

  @Output() check = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  get imageSrc() {
    return (
      '/assets/images/' +
      (this.checked ? this._radioOnImage : this._radioOffImage)
    );
  }

  onRadioChange() {
    this.check.emit(this.value);
  }
}
