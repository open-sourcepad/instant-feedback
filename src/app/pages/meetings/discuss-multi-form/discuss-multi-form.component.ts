import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActionItemService, GeneralItemService } from '../../../services/api';

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
  currentTab: string = 'action';
  loadingEmployeeItems: boolean = false;
  employeeItems = [];
  loadingManagerItems: boolean = false;
  managerItems = [];
  editNote: string = '';
  editActionIdx: any = {employee: null, manager: null};
  newEdit: any = {employee: false, manager: false};


  employeeItemForm: FormGroup;
  managerItemForm: FormGroup;

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

    this.employeeItemForm = this.fb.group({
      'note': [''],
      'employee_id': ['', Validators.required],
      'meeting_id': [this.slug_id, Validators.required]
    });

    this.managerItemForm = this.fb.group({
      'note': [''],
      'manager_id': ['', Validators.required],
      'meeting_id': [this.slug_id, Validators.required]
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

    if(changes.actionItems && !changes.actionItems.isFirstChange()){
      this.employeeItemForm.get('employee_id').setValue(this.actionItems.employee.id);
      this.managerItemForm.get('manager_id').setValue(this.actionItems.manager.id);
      this.employeeItemForm.updateValueAndValidity();
      this.managerItemForm.updateValueAndValidity();
    }
  }

  addActionItem(user, values) {
    if(user == 'employee') {
      this.loadingEmployeeItems = true;
      this.actionItemApi.create(values)
        .subscribe(res => {
          this.loadingEmployeeItems = false;
          this.actionItems.employee.items.data.push(res['data']);
          this.employeeItemForm.get('note').setValue('');
          this.employeeItemForm.get('note').updateValueAndValidity();
        }, err => {
          this.loadingEmployeeItems = false;
        });
    }else {
      this.loadingManagerItems = true;
      this.actionItemApi.create(values)
        .subscribe(res => {
          this.loadingManagerItems = false;
          this.actionItems.manager.items.data.push(res['data']);
          this.managerItemForm.get('note').setValue('');
          this.managerItemForm.get('note').updateValueAndValidity();
        }, err => {
          this.loadingManagerItems = false;
        });
    }
  }


  editActionItem(obj, idx, user){
    if(this.editNote){
      this.newEdit[user] = true;
      let params = {note: this.editNote};
      this.saveActionItem(user, params, this.actionItems[user].items.data[this.editActionIdx[user]]);
    }
    this.editNote = obj.note;
    this.editActionIdx[user] = idx;
  }

  saveActionItem(user, values, obj) {
    if(user == 'employee') {
      this.loadingEmployeeItems = true;
      this.actionItemApi.update(obj.id, values)
        .subscribe(res => {
          this.loadingEmployeeItems = false;
          obj.note = values.note;
          if(!this.newEdit[user]) {
            this.editNote = null;
            this.editActionIdx[user] = null;
          }
          this.newEdit = false;
        }, err => {
          this.loadingEmployeeItems = false;
        });
    }else {
      this.loadingManagerItems = true;
      this.actionItemApi.update(obj.id, values)
        .subscribe(res => {
          this.loadingManagerItems = false;
          obj.note = values.note;
          if(!this.newEdit[user]) {
            this.newEdit = false;
            this.editNote = null;
            this.editActionIdx[user] = null;
          }
        }, err => {
          this.loadingManagerItems = false;
        });
    }
  }

  removeActionItem(obj, idx, user) {
    if(user == 'employee') {
      this.loadingEmployeeItems = true;
    }else {
      this.loadingManagerItems = true;
    }
    this.actionItemApi.destroy(obj.id)
    .subscribe(res => {
        if(user == 'employee') {
          this.loadingEmployeeItems = false;
        }else {
          this.loadingManagerItems = false;
        }
        this.actionItems[user].items.data.splice(idx, 1);
      }, err => {
        if(user == 'employee') {
          this.loadingEmployeeItems = false;
        }else {
          this.loadingManagerItems = false;
        }
      });
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
