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
  loadingGeneralItems: boolean = false;
  generalItems = [];
  loadingEmployeeItems: boolean = false;
  employeeItems = [];
  loadingManagerItems: boolean = false;
  managerItems = [];

  generalItemForm: FormGroup;
  employeeItemForm: FormGroup;
  managerItemForm: FormGroup;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private generalItemApi: GeneralItemService,
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
        }else {
          this.idx = 0;
        }
      });

    this.generalItemForm = this.fb.group({
      'note': [''],
      'meeting_id': [this.slug_id, Validators.required]
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

    this.loadGeneralItems();
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
        this.changeQuery('start');
      }
    }

    if(changes.actionItems && !changes.actionItems.isFirstChange()){
      this.employeeItemForm.get('employee_id').setValue(this.actionItems.employee.id);
      this.managerItemForm.get('manager_id').setValue(this.actionItems.manager.id);
      this.employeeItemForm.updateValueAndValidity();
      this.managerItemForm.updateValueAndValidity();
    }
  }

  loadGeneralItems() {
    this.loadingGeneralItems = true;
    this.generalItemApi.query({meeting_id: this.slug_id})
      .subscribe(res => {
        this.loadingGeneralItems = false;
        this.generalItems = res['collection']['data'];
      }, err => {
        this.loadingGeneralItems = false;
      });
  }

  addGeneralItem(values){
    this.loadingGeneralItems = true;
    this.generalItemApi.create(values)
      .subscribe(res => {
        this.loadingGeneralItems = false;
        this.generalItems.push(res['data']);
        this.generalItemForm.get('note').setValue('');
        this.generalItemForm.get('note').updateValueAndValidity();
      }, err => {
        this.loadingGeneralItems = false;
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

  editGeneralItem(obj, idx) {

  }

  editActionItem(obj, idx){

  }

  nextPoint(){
    if(this.idx < this.discussions.length){
      this.idx += 1;
     }
  }

  prevPoint(){
    if(this.idx > 0){
      this.idx -= 1;
    }
  }

  cancel(){
    this.router.navigateByUrl(`/one-on-ones/${this.slug_id}`);
  }

  changeTab(tab_name) {
    this.currentTab = tab_name;
  }

  changeQuery(action) {
    this.router.navigate(['.'], { relativeTo: this.activeRoute, queryParams: {action: action}});
  }

}
