import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IUser } from '../models/IUser';

@Injectable({
    providedIn: 'root'
})
export class UserFormService {

    http = inject(HttpClient)
    baseUrl: string = "http://localhost:4200/";   

    fetchUsers(){ 
         return this.http.get<IUser[]>('https://jsonplaceholder.typicode.com/users/');
          
    }

    addUser(user: IUser){
        this.http.post<IUser>('https://jsonplaceholder.typicode.com/user', user); 
    }

}
