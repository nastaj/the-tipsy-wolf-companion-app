import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { AuthService } from '../../core/auth/auth.service';
import { isSupabaseConfigured } from '../../core/supabase.client';

type Mode = 'sign-in' | 'create';

// Supabase's default minimum password length.
const MIN_PASSWORD_LENGTH = 6;

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  imports: [IonContent, IonIcon, ReactiveFormsModule],
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSupabaseConfigured = isSupabaseConfigured;
  protected readonly minPasswordLength = MIN_PASSWORD_LENGTH;

  protected readonly mode = signal<Mode>('sign-in');
  protected readonly showPassword = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Set after sign-up when Supabase requires email confirmation. */
  protected readonly confirmationSentTo = signal<string | null>(null);

  protected readonly form = new FormGroup({
    keeperName: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)],
    }),
  });

  protected setMode(mode: Mode): void {
    this.mode.set(mode);
    this.error.set(null);
    this.confirmationSentTo.set(null);

    const keeperName = this.form.controls.keeperName;
    keeperName.setValidators(mode === 'create' ? [Validators.required, Validators.maxLength(24)] : []);
    keeperName.updateValueAndValidity();
  }

  protected showError(control: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { keeperName, email, password } = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set(null);

    try {
      if (this.mode() === 'sign-in') {
        await this.auth.signIn(email, password);
      } else {
        const { needsConfirmation } = await this.auth.signUp(email, password, keeperName.trim());
        if (needsConfirmation) {
          this.confirmationSentTo.set(email);
          return;
        }
      }
      await this.router.navigateByUrl('/keepers', { replaceUrl: true });
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
