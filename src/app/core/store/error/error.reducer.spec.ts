import { using } from 'rxjs';
import { anything } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { loginUserSuccess } from 'ish-core/store/user';

import { generalError, serverError, timeoutError } from './error.actions';
import { errorReducer, initialState } from './error.reducer';

describe('Error Reducer', () => {
  describe('initialState', () => {
    it('should not have an error when unmodified', () => {
      expect(initialState.current).toBeUndefined();
    });

    it('should not have a type when unmodified', () => {
      expect(initialState.type).toBeFalsy();
    });
  });

  describe('reducer', () => {
    it('should return initial state when undefined state is supplied', () => {
      const newState = errorReducer(undefined, {} as ReturnType<
        typeof generalError | typeof timeoutError | typeof serverError
      >);

      expect(newState).toEqual(initialState);
    });
  });

  function dataProvider() {
    return [
      {
        state: initialState,
        action: {} as ReturnType<typeof generalError | typeof timeoutError | typeof serverError>,
        expected: initialState,
      },
      {
        state: initialState,
        action: timeoutError({ payload: { error: {} as HttpError } }),
        expected: { current: {}, type: timeoutError.type },
      },
      {
        state: initialState,
        action: loginUserSuccess({ payload: anything() }),
        expected: initialState,
      },
    ];
  }

  using(dataProvider, dataSlice => {
    it(`should return ${
      dataSlice.expected === initialState ? ' initialState' : ` '${dataSlice.expected.type}'`
    } when Action ${dataSlice.action.type} is reduced on state ${dataSlice.state.type}`, () => {
      const newState = errorReducer(dataSlice.state, dataSlice.action);
      expect(newState).toEqual(dataSlice.expected);
    });
  });
});
