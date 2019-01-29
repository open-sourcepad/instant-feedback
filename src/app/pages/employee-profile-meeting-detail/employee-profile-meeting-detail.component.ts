import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/api';

@Component({
  selector: 'app-employee-profile-meeting-detail',
  templateUrl: './employee-profile-meeting-detail.component.pug',
  styleUrls: ['./employee-profile-meeting-detail.component.scss']
})
export class EmployeeProfileMeetingDetailComponent implements OnInit {
  private sub: any;
  private slug_id: number;
  private employee_id: number = null;

  currentObj;
  actionItems;
  currentUser;
  meetingStatus;
  discussions = [];
  userIsManager: boolean = false;
  loading: boolean = false;
  paginate = {prev: null, next: null};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userApi: UserService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.slug_id = +params['id'];
      if(params['employee_id']) this.employee_id = +params['employee_id'];
      if(this.slug_id){
        this.loadData(this.slug_id);
      }
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  loadData(slug_id) {
    this.userApi.showMeeting(this.employee_id, this.slug_id)
      .subscribe( res => {
        this.loading = false;
        this.currentObj = res['data'];
        this.meetingStatus = this.currentObj['status'];
        this.discussions = res['data']['discussions']['data'];
        this.actionItems = res['data']['action_items'];
        this.paginate['prev'] = res['links']['prev'];
        this.paginate['next'] = res['links']['next']
      }, err => {
        this.loading = false;
      });
  }

  navigate(url) {
    this.router.navigateByUrl(url);
  }

}
