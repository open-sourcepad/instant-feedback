import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActionItemService, GeneralItemService } from '../../../services/api';

@Component({
  selector: 'review-summary',
  templateUrl: './review-summary.component.pug',
  styleUrls: ['./review-summary.component.scss']
})
export class ReviewSummaryComponent implements OnInit {

  @Input() actionItems;
  @Input() discussions;
  @Input() slug_id;


  action: string = '';
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
  ) {
    this.activeRoute.queryParams
      .subscribe(params => {
        var cur_position = (+params['action']);
        if((params['action'] == 'review' || params['action'] == 'schedule')) {
          this.action = params['action'];
        }else if(cur_position){
          this.changeQuery(cur_position);
        }else {
          this.changeQuery('start');
        }
      });
  }

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

  changeQuery(action) {
    this.router.navigate(['.'], { relativeTo: this.activeRoute, queryParams: {action: action}});
  }

  prevAction(){
    if(this.action == 'review'){
      this.changeQuery(this.discussions.length);
    }

    if(this.action == 'schedule'){
      this.changeQuery('review');
    }
  }

  nextAction(action){
    this.changeQuery(action);
  }

}
