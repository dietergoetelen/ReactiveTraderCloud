import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { map, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { createPopout, undockPopout } from '../../../services/popout'
import { ACTION_TYPES as TILE_ACTIONS, SpotTileActions } from '../../spotTile/actions'
import { ACTION_TYPES as REGIONS_ACTIONS, RegionActions } from '../regions'

const { openWindow } = RegionActions
const { undockTile, tileUndocked } = SpotTileActions
export type OpenWindowAction = ReturnType<typeof openWindow>
export type UndockAction = ReturnType<typeof undockTile>

const popoutWindowEpic: ApplicationEpic = (action$, state$, { popoutService }) =>
  action$.pipe(
    ofType<Action, OpenWindowAction>(REGIONS_ACTIONS.REGION_OPEN_WINDOW),
    map(({ payload }) => createPopout(payload, state$, popoutService))
  )

const undockTileEpic: ApplicationEpic = (action$, state$, { popoutService }) =>
  action$.pipe(
    ofType<Action, UndockAction>(TILE_ACTIONS.UNDOCK_TILE),
    tap(({ payload }) => undockPopout(payload, popoutService)),
    map(tileUndocked)
  )

export const popoutEpic = combineEpics(popoutWindowEpic, undockTileEpic)
