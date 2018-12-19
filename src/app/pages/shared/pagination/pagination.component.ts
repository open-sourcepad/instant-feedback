import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.pug',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit {

  @Input() config: PaginationInstance;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();


  ngOnInit() {
  }

}
