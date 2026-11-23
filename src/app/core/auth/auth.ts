import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { catchError, from, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServiceCode } from '../../weekly-request/weekly-request.model';
import { Token } from './token';
import { UserDetailsResponse, UserSession } from './user-session';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly token = inject(Token);

  private readonly _currentUser = signal<UserSession | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly userRole = computed(() => this._currentUser()?.role ?? null);
  readonly userServiceCode = computed(() => this._currentUser()?.serviceCode ?? null);
  readonly userName = computed(
    () => this._currentUser()?.name ?? this._currentUser()?.email ?? 'Usuário',
  );

  getUserProfile(): Observable<UserSession> {
    return this.http.get<UserDetailsResponse>(`${environment.apiUrl}/users/me`).pipe(
      map((user) => ({
        uid: user.firebaseUid || this.token.firebaseAuth.currentUser?.uid || '',
        email: user.email,
        name: user.name,
        role: user.role,
        serviceCode: user.serviceCode,
      })),
      tap((session) => this._currentUser.set(session)),
    );
  }

  login(email: string, password: string): Observable<UserSession> {
    return from(signInWithEmailAndPassword(this.token.firebaseAuth, email.trim(), password)).pipe(
      switchMap(() => this.getUserProfile()),
      catchError((err: unknown) => {
        if (err instanceof FirebaseError) {
          return throwError(() => new Error(this.mapFirebaseError(err)));
        }
        return throwError(
          () => new Error('Usuário autenticado no Firebase, mas não encontrado no sistema.'),
        );
      }),
    );
  }

  async logout(): Promise<void> {
    await signOut(this.token.firebaseAuth);
    this._currentUser.set(null);
  }

  canAccessService(serviceCode: ServiceCode | string): boolean {
    const user = this._currentUser();
    if (!user) return false;
    if (user.role === 'BUYER') return true;
    if (!user.serviceCode) return false;

    return user.serviceCode.toUpperCase() === serviceCode.toUpperCase();
  }

  private mapFirebaseError(err: FirebaseError): string {
    switch (err.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos.';
      case 'auth/user-disabled':
        return 'Esta conta foi desativada pela gestão.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas sem sucesso. Aguarde alguns instantes.';
      case 'auth/invalid-email':
        return 'Formato de e-mail inválido.';
      default:
        return 'Falha na autenticação. Verifique seu e-mail e senha.';
    }
  }
}
