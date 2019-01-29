import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/api';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models';
import { RoutingState } from 'src/app/services/utils';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.pug',
  styleUrls: ['./employee-profile.component.scss', '../employee/employee.component.scss']
})
export class EmployeeProfileComponent implements OnInit {

  currentUser: User;
  slug_id: number;
  showModal: boolean = false;
  modalText: any = {body: ''};
  modalButtons: any = {confirm: {text: 'Close'}};

  constructor(
    private userApi: UserService,
    private route: ActivatedRoute,
    private routingState: RoutingState
  ) {
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.slug_id = +params['id'];
      this.userApi.get(this.slug_id).subscribe(res => {
        this.currentUser = new User(res['data']);
      });
    });

    this.routingState.setPreviousUrl(null);
  }

  modalStateChange(value) {
    this.showModal = value;
  }

}
