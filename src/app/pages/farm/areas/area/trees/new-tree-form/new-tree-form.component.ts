import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, filter, finalize, first, map, mergeMap, tap } from 'rxjs';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { AreaRouteParamsComponent } from '../../route-params.inheritable';
import { TreeNameIsUniqueValidator } from './tree-name-is-unique.validator';

@Component({
  selector: 'app-new-tree-form',
  templateUrl: './new-tree-form.component.html',
  styleUrls: ['./new-tree-form.component.css', '../../../../../../../styles/basic-form.css'],
  providers: [TreeNameIsUniqueValidator],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTreeFormComponent extends AreaRouteParamsComponent implements OnInit {
  public newTreeFromGroup = new FormGroup({
    regularId: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.treeNameIsUnique.validate.bind(this.treeNameIsUnique)],
    }),
    species: new FormControl('', [Validators.required]),
    startHeight: new FormControl(1, [Validators.required]),
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  public treeIdError = this.newTreeFromGroup.statusChanges.pipe(
    filter((status) => status !== 'PENDING'),
    map(() => {
      return this.newTreeFromGroup.controls.regularId.errors
        ? Boolean(this.newTreeFromGroup.controls.regularId.errors['treeIdNotUnique'])
        : false;
    }),
  );

  constructor(private treeNameIsUnique: TreeNameIsUniqueValidator, private logService: LogService) {
    super();
  }

  ngOnInit(): void {
    this.getFarmIdAndAreaId()
      .pipe(
        mergeMap(([farmId, areaId]) => this.treeService.watchTrees(farmId, areaId)),
        first(),
        map((trees) => trees.reduce((regularId, tree) => (tree.regularId > regularId ? tree.regularId : regularId), 0)),
      )
      .subscribe((latestId) => this.newTreeFromGroup.controls.regularId.setValue(latestId + 1, { emitEvent: true }));
  }

  handleSubmit() {
    if (this.loadingSubject.value) return;
    this.loadingSubject.next(true);
    const regularId = this.newTreeFromGroup.controls.regularId.value!;
    const species = this.newTreeFromGroup.controls.species.value!.trim();
    const startHeight = this.newTreeFromGroup.controls.startHeight.value!;
    this.getFarmIdAndAreaId()
      .pipe(
        tap({
          next: ([farmId]) => this.logService.addLog(farmId, LogActions.AddTree).subscribe(),
        }),
        mergeMap(([farmId, areaId]) =>
          this.treeService.createTree(farmId, areaId, { regularId, species, startHeight }),
        ),
        finalize(() => {
          this.loadingSubject.next(false);
          this.newTreeFromGroup.controls.regularId.setValue(this.newTreeFromGroup.controls.regularId.value! + 1);
          this.treeService.clearPaginationCache();
        }),
      )
      .subscribe();
  }
}
