import { Injectable } from '@angular/core';
import { Firebase } from '@custom-firebase/index';
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  addDoc,
  writeBatch,
  doc,
  CollectionReference,
  DocumentData,
  DocumentReference,
  arrayUnion,
} from 'firebase/firestore';
import { AuthService, UserService } from 'ngx-firebase-user-platform';
import {
  BehaviorSubject,
  first,
  forkJoin,
  from,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs';
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
  private lastPageViewLog = new BehaviorSubject<Record<string, number>>({}); // Record<farmId, Record<actionCode, last viewed at>>

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
    const isDifferentFarm = this.cachedFarmId !== farmId;
    if (isOutdated || isDifferentFarm) this.logsCache$ = undefined;
    this.cachedFarmId = farmId;
    return (this.logsCache$ ||= from(
      (() => {
        const ref = this.getRef(farmId);
        const q = query(ref, limit(limitNumber), orderBy('createdAt', 'desc'));
        return getDocs(q);
      })(),
    ).pipe(
      map((results) => {
        if (results.empty) return [];
        return results.docs.map((doc) => ({ ...(doc.data() as LogEntry), id: doc.id }));
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
      withLatestFrom(this.authService.getUid().pipe(first())),
      map(([logs, uid]) =>
        logs.map<RenderedLogEntry>((log) => ({
          createdAt: log.createdAt,
          message: (log.displayName ?? log.email) + logDictionary.get(log.action) + log.value,
          id: log.id,
          viewedCurrentUser: (log.viewedBy ?? [uid]).includes(uid), // old logs dont have array
        })),
      ),
      shareReplay(1),
    ));
  }

  public addLog(farmId: string, actionCode: LogActions, value = ''): Observable<any> {
    let skipLog = false;
    if (viewLogActions.includes(actionCode)) {
      const key = `${farmId}-${actionCode}${value}`;
      const actionLastLoggedAt = this.lastPageViewLog.getValue()[key] ?? 0;
      const now = Date.now();
      skipLog = !(now - actionLastLoggedAt > 86400000); // 1 day
      this.lastPageViewLog.next({
        ...this.lastPageViewLog.value,
        [key]: now,
      });
    }
    if (skipLog) return of('');
    return this.authService.getUid().pipe(
      first(),
      switchMap((uid) => {
        const logData: LogEntry = { uid, createdAt: Date.now(), action: actionCode, value, viewedBy: [] };
        const ref = this.getRef(farmId);
        return addDoc(ref, logData);
      }),
    );
  }

  public setLogsAsViewed(farmId: string, logId: string | string[], ...args: string[]) {
    const coalescedLogIds = typeof logId === 'string' ? [logId, ...args] : [...logId, ...args];
    const refs = coalescedLogIds.map((id) => this.getRef(farmId, id));
    return this.authService.getUid().pipe(
      first(),
      switchMap((uid) => {
        const batch = writeBatch(Firebase.firestore);
        refs.forEach((ref) => batch.update(ref, { viewedBy: arrayUnion(uid) }));
        return batch.commit();
      }),
    );
  }

  private getRef(farmId: string, logId?: undefined): CollectionReference<DocumentData>;
  private getRef(farmId: string, logId: string): DocumentReference<DocumentData>;
  private getRef(farmId: string, logId?: string) {
    const args = [Firebase.firestore, 'farms', farmId, LogService.path] as const;
    return logId ? doc(...args, logId) : collection(...args);
  }
}
