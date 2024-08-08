import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService  {
    constructor(private toastr: ToastrService) { }

    showSuccess(message: string, title: string) {
      this.toastr.success(message, title, {
        enableHtml: true,
        timeOut: 3000,
        tapToDismiss: true,
        positionClass: 'toast-bottom-right'
      });
    }
  
    showError(message: string, title: string) {
      this.toastr.error(message, title, {
        enableHtml: true,
        tapToDismiss: true,
        positionClass: 'toast-bottom-right'
      });
    }
  
    showInfo(message: string, title: string, timeOut: number = 4000) {
      this.toastr.info(message, title, {
        enableHtml: true,
        tapToDismiss: true,
        timeOut: timeOut,
        positionClass: 'toast-bottom-right'
      });
    }
  
    showWarning(message: string, title: string) {
      this.toastr.warning(message, title, {
        enableHtml: true,
        tapToDismiss: true,
        positionClass: 'toast-bottom-right'
      });
    }

    showProgress(message: string, title: string) {
      this.toastr.info(message, title, {
        enableHtml: true,
        tapToDismiss: false,
        timeOut: 4000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    }
}