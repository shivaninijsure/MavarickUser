import { Routes } from '@angular/router';
import { UserTableComponent } from './user-table/user-table.component';
import { UserFormComponent } from './user-form/user-form.component';

export const routes: Routes = [
    { path: 'UserForm', component: UserFormComponent },
    { path: 'UserTable', component: UserTableComponent },
];
