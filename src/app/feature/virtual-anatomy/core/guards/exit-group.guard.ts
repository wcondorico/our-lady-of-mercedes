import { CanDeactivateFn } from '@angular/router';

export interface ExitGroup {
  exitGroup(): boolean;
}

export const exitGroupGuard: CanDeactivateFn<ExitGroup> = (component: ExitGroup, currentRoute, currentState, nextState) => {
  return component.exitGroup? component.exitGroup():true;
};
