import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private readonly SUCCESS_CONFIG = {
        typeClass: 'bg-success text-light',
        iconClass: 'bi-check-circle',
        autohide: true,
        delay: 5000
    };

    private readonly ERROR_CONFIG = {
        typeClass: 'bg-danger text-light',
        iconClass: 'bi-x-circle',
        autohide: false
    };

    private readonly WARNING_CONFIG = {
        typeClass: 'bg-warning',
        iconClass: 'bi-exclamation-triangle',
        autohide: true,
        delay: 5000
    };

    private readonly INFO_CONFIG = {
        typeClass: 'bg-info',
        iconClass: 'bi-info-circle',
        autohide: true,
        delay: 5000
    };


    toasts: any[] = [];

    showSuccess(message: string) {
        this.show(message, this.SUCCESS_CONFIG);
    }

    showError(message: string) {
        this.show(message, this.ERROR_CONFIG);
    }

    showWarning(message: string) {
        this.show(message, this.WARNING_CONFIG);
    }

    showInfo(message: string) {
        this.show(message, this.INFO_CONFIG);
    }

    show(message: string, options: any = {}) {
        this.toasts.push({ message, ...options });
    }

    remove(toast: any) {
        this.toasts = this.toasts.filter(t => t !== toast);
    }

    clear() {
        this.toasts.splice(0, this.toasts.length);
    }
}
