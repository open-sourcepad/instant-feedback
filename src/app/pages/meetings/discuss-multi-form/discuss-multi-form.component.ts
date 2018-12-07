import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActionItemService } from '../../../services/api';

@Component({
  selector: 'discuss-multi-form',
  templateUrl: './discuss-multi-form.component.pug',
  styleUrls: ['./discuss-multi-form.component.scss']
})
export class DiscussMultiFormComponent implements OnInit, OnChanges {

  @Input() actionItems;
  @Input() discussions;
  @Input() slug_id;

  idx: number = 0;
  action: string = '';
  actionItemEditable: boolean = true;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private actionItemApi: ActionItemService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams
      .subscribe(params => {
        this.action = params['action'];
        var cur_position = (+this.action);

        if(this.action != 'start' && cur_position) {
          if(cur_position >= this.discussions.length){
            this.idx = (this.discussions.length - 1);
          }else {
            this.idx = cur_position - 1;
          }
        }else if(this.action == 'review' || this.action == 'schedule') {
          this.idx = this.discussions.length;
        }else {
          this.idx = 0;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.discussions && !changes.discussions.isFirstChange()){
      var cur_position = +this.action;
      if(cur_position){
        if(cur_position >= this.discussions.length){
          this.idx = (this.discussions.length - 1);
          this.changeQuery(this.idx+1);
        }else {
          this.idx = cur_position - 1;
        }
      }else {
        if(this.action == 'start' || this.action == 'review' || this.action == 'schedule'){
          this.changeQuery(this.action);
        }else {
          this.changeQuery('start');
        }
      }
    }

  }

  nextPoint(){
    var arr_length = this.discussions.length - 1;
    if(this.idx <= this.discussions.length){
      this.idx += 1;
      if(this.idx > arr_length) {
        this.changeQuery('review');
      }else{
       this.changeQuery(this.idx+1);
      }
    }
  }

  prevPoint(){
    if(this.idx > 0){
      this.idx -= 1;
      if(this.idx <= 0) {
        this.changeQuery('start');
      }else{
       this.changeQuery(this.idx+1);
      }
    }
  }

  cancel(){
    this.router.navigateByUrl(`/one-on-ones/${this.slug_id}`);
  }

  changeQuery(action) {
    this.router.navigate(['.'], { relativeTo: this.activeRoute, queryParams: {action: action}});
  }

}
