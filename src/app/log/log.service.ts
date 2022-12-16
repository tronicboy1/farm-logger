import { Injectable } from '@angular/core';
import { Firebase } from '@custom-firebase/index';
import { AuthService } from '@user/auth.service';
import { UserData, UserService } from '@user/user.service';
import { collection, getDocs, query, limit, orderBy, addDoc } from 'firebase/firestore';
import { BehaviorSubject, first, forkJoin, from, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { LogActions, logDictionary, LogEntry, RenderedLogEntry, viewLogActions } from './log.model';
import { LogModule } from './log.module';

@Injectable({
  providedIn: LogModule,
})
export class LogService {
  static path = 'logs';
  private logsCache$?: Observable<RenderedLogEntry[]>;
  private lastFetched?: Date;
  private cachedFarmId?: string;
  private lastPageViewLog = new BehaviorSubject<Record<string, Record<number, number>>>({}); // Record<farmId, Record<actionCode, last viewed at>>

  constructor(protected authService: AuthService, protected userService: UserService) {
    const lastPageViewLogLocalStorageCache = window.localStorage.getItem('lastPageViewLog');
    if (lastPageViewLogLocalStorageCache) {
      const parsed = JSON.parse(lastPageViewLogLocalStorageCache);
      this.lastPageViewLog.next(parsed);
    }

    this.lastPageViewLog.subscribe((state) => {
      const json = JSON.stringify(state);
      window.localStorage.setItem('lastPageViewLog', json);
    });
  }

  public getLogs(farmId: string, limitNumber = 10): Observable<RenderedLogEntry[]> {
    const isOutdated = this.lastFetched && Date.now() - this.lastFetched.getTime() > 240000; // 4 mins
    const isDifferentFarm = this.cachedFarmId === farmId;
    if (isOutdated || isDifferentFarm) this.logsCache$ = undefined;
    return (this.logsCache$ ||= from(
      (() => {
        const ref = this.getLogsCollection(farmId);
        const q = query(ref, limit(limitNumber), orderBy('createdAt', 'desc'));
        return getDocs(q);
      })(),
    ).pipe(
      map((results) => {
        if (results.empty) return [];
        return results.docs.map((doc) => doc.data() as LogEntry);
      }),
      switchMap((logs) =>
        forkJoin(
          logs.map((log) =>
            this.userService.watchUserDoc(log.uid).pipe(
              first(),
              map((userData) => ({ ...log, ...userData })),
            ),
          ),
        ),
      ),
      map((logs) =>
        logs.map<RenderedLogEntry>((log) => ({
          createdAt: log.createdAt,
          message: log.displayName ?? log.email + logDictionary[log.action] + log.value,
        })),
      ),
      shareReplay(1),
    ));
  }

  public addLog(farmId: string, actionCode: LogActions, value = ''): Observable<any> {
    let skipLog = false;
    if (viewLogActions.includes(actionCode)) {
      const lastPageViewLogForFarm = this.lastPageViewLog.getValue()[farmId] ?? {};
      const now = Date.now();
      const actionLastLoggedAt = lastPageViewLogForFarm[actionCode] ?? 0;
      skipLog = now - actionLastLoggedAt > 2400000; // 40 mins
      this.lastPageViewLog.next({
        ...this.lastPageViewLog.value,
        [farmId]: { ...lastPageViewLogForFarm, [actionCode]: now },
      });
    }
    return skipLog
      ? this.authService.getUid().pipe(
          first(),
          switchMap((uid) => {
            const logData: LogEntry = { uid, createdAt: Date.now(), action: actionCode, value };
            const ref = this.getLogsCollection(farmId);
            return addDoc(ref, logData);
          }),
        )
      : of();
  }

  private getLogsCollection(farmId: string) {
    return collection(Firebase.firestore, 'farms', farmId, LogService.path);
  }
}
