import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActionItemService } from '../../../services/api';

@Component({
  selector: 'meeting-action-items',
  templateUrl: './meeting-action-items.component.pug',
  styleUrls: ['./meeting-action-items.component.scss']
})
export class MeetingActionItemsComponent implements OnInit {

  @Input() actionItems;
  @Input() slug_id;
  @Input() allowEdit;

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

}
