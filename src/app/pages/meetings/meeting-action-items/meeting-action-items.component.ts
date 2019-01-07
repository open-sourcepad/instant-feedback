import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActionItemService } from '../../../services/api';

@Component({
  selector: 'meeting-action-items',
  templateUrl: './meeting-action-items.component.pug',
  styleUrls: ['./meeting-action-items.component.scss']
})
export class MeetingActionItemsComponent implements OnInit, OnChanges {

  @Input() actionItems;
  @Input() slug_id;
  @Input() allowEdit;
  @Input() allowReviewEdit;

  loading = {
    employee: false,
    manager: false
  }
  submitted = {
    employee: false,
    manager: false
  }

  employeeItems = [];
  managerItems = [];
  editNote: string = '';
  editActionIdx: any = {employee: null, manager: null};
  newEdit: any = {employee: false, manager: false};
  reviewEdit: boolean = false;
  userRole: string = '';

  employeeItemForm: FormGroup;
  managerItemForm: FormGroup;

  //confirmation modal
  showModal: boolean = false;
  removeObj = null;
  modalText: any = {body: 'Are you sure you want to delete it?'};
  modalButtons: any = {cancel: {text: 'Cancel'}, confirm: {text: 'Yes, delete.'}};

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private actionItemApi: ActionItemService,
    private fb: FormBuilder
   ) { }

  get e() { return this.employeeItemForm.controls; }
  get m() { return this.managerItemForm.controls; }

  ngOnInit() {
    this.employeeItemForm = this.fb.group({
      'note': ['', Validators.required],
      'user_id': ['', Validators.required],
      'meeting_id': [this.slug_id, Validators.required]
    });

    this.managerItemForm = this.fb.group({
      'note': ['', Validators.required],
      'user_id': ['', Validators.required],
      'meeting_id': [this.slug_id, Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.actionItems && !changes.actionItems.isFirstChange()){
      this.employeeItemForm.get('user_id').setValue(this.actionItems.employee.id);
      this.managerItemForm.get('user_id').setValue(this.actionItems.manager.id);
      this.employeeItemForm.updateValueAndValidity();
      this.managerItemForm.updateValueAndValidity();
    }
  }

  onSubmit(action, values, role) {
    this.userRole = role;
    if(action == 'create') {
      this.submitted[this.userRole] = true;

      if(this.userRole == 'employee') {
        if(values.note.trim() == '') this.e.note.setValue('');
        if(this.employeeItemForm.invalid) {
          return;
        }
      }else {
        if(values.note.trim() == '') this.m.note.setValue('');
        if(this.managerItemForm.invalid) {
          return;
        }
      }

      this.addActionItem(values);
    }else {
      //action == remove
      this.modalStateChange(true);
      this.removeObj = values;
    }
  }

  addActionItem(values) {
    this.loading[this.userRole] = true;

    this.actionItemApi.create(values)
      .subscribe(res => {
        this.loading[this.userRole] = false;
        this.submitted[this.userRole] = false;
        if(this.userRole == 'employee') {
          this.actionItems.employee.items.data.push(res['data']);
          this.employeeItemForm.get('note').setValue('');
          this.employeeItemForm.get('note').updateValueAndValidity();
        }else {
          this.actionItems.manager.items.data.push(res['data']);
          this.managerItemForm.get('note').setValue('');
          this.managerItemForm.get('note').updateValueAndValidity();
        }
      }, err => {
        this.loading[this.userRole] = false;
        this.submitted[this.userRole] = false;
      });
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

  saveActionItem(role, values, obj) {
    this.actionItemApi.update(obj.id, values)
      .subscribe(res => {
        this.loading[role] = false;
        this.submitted[this.userRole] = false;
        obj.note = values.note;
        if(!this.newEdit[role]) {
          this.editNote = null;
          this.editActionIdx[role] = null;
        }
        this.newEdit = false;
      }, err => {
        this.loading[role] = false;
        this.submitted[this.userRole] = false;
      });
  }

  removeActionItem(obj) {
    this.loading[this.userRole] = true;
    let idx = this.actionItems[this.userRole].items.data.findIndex(x => x.id == obj.id);

    this.actionItemApi.destroy(obj.id)
      .subscribe(res => {
        this.loading[this.userRole] = false;
        this.removeObj = null;

        this.actionItems[this.userRole].items.data.splice(idx, 1);
      }, err => {
        this.loading[this.userRole] = false;
      });
  }

  modalStateChange(value) {
    this.showModal = value;
  }

  onRemove(values) {
    this.removeActionItem(values);
  }

}
