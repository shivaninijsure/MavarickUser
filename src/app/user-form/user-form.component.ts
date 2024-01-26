import { Component, OnInit } from '@angular/core';
import { UserFormService } from '../services/user-form.service';
import { ReactiveFormsModule, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IUserFormGroup } from '../models/IUserFormGroup';
import { Router } from '@angular/router';
import { FileUploadService } from '../services/FileUploadService';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IUser } from '../models/IUser';
import { UserTableComponent } from "../user-table/user-table.component";

@Component({
	selector: 'app-user-form',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, UserTableComponent],
	templateUrl: './user-form.component.html',
	styleUrl: './user-form.component.css',
})


export class UserFormComponent {
	selectedFiles?: FileList;
	currentFile?: File;
	progress = 0;
	message = '';
	preview = '';
	
	imageInfos?: Observable<any>;

	userForm: IUserFormGroup;

	userSubject: Subject<IUser> = new Subject<IUser>();

	isUpdate: boolean = false;

	constructor(private formBuilder: FormBuilder, private userFormService: UserFormService, private router: Router, private uploadService: FileUploadService) {
		this.userForm = this.formBuilder.group({
			name: new FormControl('', Validators.required),
			email: new FormControl('', [Validators.required, Validators.email]),
			phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
			city: new FormControl('', Validators.required),
			image: new FormControl('')
		}) as IUserFormGroup;
	}

	ngOnInit(): void {
		this.isUpdate = false;
		this.imageInfos = this.uploadService.getFiles();
	  }
	

	onSubmit() {
		if (!this.userForm.valid) {
			this.userForm.markAllAsTouched();
		}

		let user = this.userForm.value;

		//Set image
		user.image = this.preview;

		//Call Post API
		this.userFormService.addUser(user);

		this.userSubject.next(user);
	
		//Reset Form
		this.userForm.reset();

		this.isUpdate = false;
		this.preview = '';
		//Navigate to User Table
		// Will disable for now
		// this.router.navigate(['/UserTable']);
	}

	updateUserEvent(user: IUser) {

		// Set User Form Values
		this.userForm.setValue(user);
		this.preview = user.image;
		this.isUpdate = true;
	}

	selectFile(event: any): void {
		this.message = '';
		this.preview = '';
		this.progress = 0;
		this.selectedFiles = event.target.files;
	
		if (this.selectedFiles) {
		  const file: File | null = this.selectedFiles.item(0);
	
		  if (file) {
			this.preview = '';
			this.currentFile = file;
	
			const reader = new FileReader();
	
			reader.onload = (e: any) => {
			  this.preview = e.target.result;
			};
	
			reader.readAsDataURL(this.currentFile);
		  }
		}
	  }
	
	  upload(): void {
		this.progress = 0;
	
		if (this.selectedFiles) {
		  const file: File | null = this.selectedFiles.item(0);
	
		  if (file) {
			this.currentFile = file;
	
			this.uploadService.upload(this.currentFile).subscribe({
			  next: (event: any) => {
				if (event.type === HttpEventType.UploadProgress) {
				  this.progress = Math.round((100 * event.loaded) / event.total);
				} else if (event instanceof HttpResponse) {
				  this.message = event.body.message;
				  this.imageInfos = this.uploadService.getFiles();
				}
			  },
			  error: (err: any) => {
				console.log(err);
				this.progress = 0;
	
				if (err.error && err.error.message) {
				  this.message = err.error.message;
				} else {
				  this.message = 'Could not upload the image!';
				}
	
				this.currentFile = undefined;
			  },
			});
		  }
	
		  this.selectedFiles = undefined;
		}
	  }

}