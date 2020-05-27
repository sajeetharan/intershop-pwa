import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { User } from 'ish-core/models/user/user.model';

import { UsersService } from '../../services/users/users.service';

import * as actions from './users.actions';
import { UsersEffects } from './users.effects';

describe('Users Effects', () => {
  let actions$: Observable<Action>;
  let effects: UsersEffects;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = mock(UsersService);
    when(usersService.getUsers()).thenReturn(of([{ businessPartnerNo: '1' }, { businessPartnerNo: '2' }] as User[]));
    when(usersService.deleteUser(anything())).thenReturn(of(true));

    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        { provide: UsersService, useFactory: () => instance(usersService) },
      ],
    });

    effects = TestBed.inject(UsersEffects);
  });

  describe('loadUsers$', () => {
    it('should call the service for retrieving users', done => {
      actions$ = of(new actions.LoadUsers());

      effects.loadUsers$.subscribe(() => {
        verify(usersService.getUsers()).once();
        done();
      });
    });

    it('should retrieve users when triggered', done => {
      actions$ = of(new actions.LoadUsers());

      effects.loadUsers$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Users API] Load Users Success:
            users: [{"businessPartnerNo":"1"},{"businessPartnerNo":"2"}]
        `);
        done();
      });
    });
  });

  describe('deleteUser$', () => {
    const user = { email: 'pmiller@test.intershop.de' } as User;

    it('should call the service for delete user', done => {
      actions$ = of(new actions.DeleteUser({ user }));

      effects.deleteUser$.subscribe(() => {
        verify(usersService.deleteUser(anything())).once();
        done();
      });
    });

    it('should delete user when triggered', done => {
      actions$ = of(new actions.DeleteUser({ user }));

      effects.deleteUser$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Users API] Delete User Success:
            user: {"email":"pmiller@test.intershop.de"}
        `);
        done();
      });
    });
  });
});
