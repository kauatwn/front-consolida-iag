import { computed, Service, signal } from '@angular/core';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Service()
export class Token {
  private readonly app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);

  readonly firebaseAuth = getAuth(this.app);
  readonly firebaseUser = signal<User | null>(null);
  readonly isInitialized = signal(false);
  readonly isAuthenticated = computed(() => this.firebaseUser() !== null);

  constructor() {
    onAuthStateChanged(this.firebaseAuth, (user) => {
      this.firebaseUser.set(user);
      this.isInitialized.set(true);
    });
  }

  async getAccessToken(forceRefresh = false): Promise<string | null> {
    const user = this.firebaseAuth.currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  }
}
