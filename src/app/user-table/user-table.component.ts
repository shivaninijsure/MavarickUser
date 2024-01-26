import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserFormService } from '../services/user-form.service';
import { IUser } from '../models/IUser';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent implements OnInit, OnDestroy {

  constructor(public userFormService: UserFormService) { }

  loading: boolean = true;
  posts: IUser[] = [];

  @Input() userObservable: Observable<IUser> | undefined;
  @Input() isChild: boolean = false;

  userSubscription: Subscription | undefined;

  @Output() updateUserEvent = new EventEmitter<IUser>();

  ngOnInit(): void {
    // Fetch Users from API if not a child component
    if (!this.isChild) {
      this.userFormService.fetchUsers()
        .subscribe((posts) => {
          console.log(posts);
          this.posts = posts;
          this.loading = false;
        });
    }

    // Subscribe to userObservable if a child component for component to component communication
    if (this.isChild && this.userObservable) {
      this.userSubscription = this.userObservable.subscribe((data) => {

        // Add or Update User
        let postIndex = this.posts.findIndex(x => x.name === data.name);
        if (postIndex > -1) {
          this.posts[postIndex] = data;
        }
        else {
          this.posts.push(data);
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Destroy userSubscription if a child component
    if (this.isChild && this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  updateUser(user: IUser) {

    // Only for child component else routing will be used
    if (this.isChild) {
      this.updateUserEvent.emit(user);
    }
    else {
      // Route with id
      // Not implemented
      // this.router.navigate(['/UserForm/{id}']);
    }
  }
}
