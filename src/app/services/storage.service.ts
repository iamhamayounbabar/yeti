import { Injectable } from '@angular/core';
import { ToasterService } from './toaster.service';

@Injectable()
export class StorageService  {

    constructor(private toasterService: ToasterService)  { }
    
    async get(key: string) {
        try {
            const ret = localStorage.getItem(key);
            return ret; 
        } catch {
            this.toasterService.showError("Error!: Unable to retrieve local settings for "+ key, '');
            return null;
        }  
    }

    async set(key: string, value: string) {
        try {
            localStorage.setItem(
               key, value
            );
        } catch {
            this.toasterService.showError("Error!: Unable to save local settings for "+ key, '');
        }
    }

    async remove(key: string) {
        try {
            localStorage.removeItem(key);
        }
        catch {
            this.toasterService.showError("Unable to disconnect, try again", '');
        }

    }
}