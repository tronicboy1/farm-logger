import { Injectable } from "@angular/core";
import { Firebase } from "@custom-firebase/index";
import { AuthService } from "@user/auth.service";
import { UserData, UserService } from "@user/user.service";
import { collection, getDocs, query, limit, orderBy, addDoc } from "firebase/firestore";
import { first, forkJoin, from, map, Observable, switchMap } from "rxjs";
import { logDictionary, LogEntry, RenderedLogEntry } from "./log.model";
import { LogModule } from "./log.module";

@Injectable({
  providedIn: LogModule,
})
export class LogService {
  static path = "logs";
  private logsCache$?: Observable<RenderedLogEntry[]>;
  private lastFetched?: Date;
  private cachedFarmId?: string;

  constructor(protected authService: AuthService, protected userService: UserService) {}

  public getLogs(farmId: string, limitNumber = 10): Observable<RenderedLogEntry[]> {
    const isOutdated = this.lastFetched && Date.now() - this.lastFetched.getTime() > 240000;
    const isDifferentFarm = this.cachedFarmId === farmId;
    if (isOutdated || isDifferentFarm) this.logsCache$ = undefined;
    return (this.logsCache$ ||= from(
      (() => {
        const ref = collection(Firebase.firestore, farmId, LogService.path);
        const q = query(ref, limit(limitNumber), orderBy("createdAt", "desc"));
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
    ));
  }

  public addLog(farmId: string, actionCode: number, value = "") {
    return this.authService.getUid().pipe(
      first(),
      switchMap((uid) => {
        const logData: LogEntry = { uid, createdAt: Date.now(), action: actionCode, value };
        const ref = collection(Firebase.firestore, farmId, LogService.path);
        return addDoc(ref, logData);
      }),
    );
  }
}
