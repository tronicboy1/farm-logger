import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CoffeeTreeForm } from '@farm/plants/coffee-tree/tree.model';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { BehaviorSubject, filter, first, map, mergeMap, tap } from 'rxjs';
import { TreeIdInheritable } from '../tree-id.inhertible';
import { TreeNameIsUniqueValidator } from './tree-name-is-unique.validator';

@Component({
  selector: 'farm-edit-tree-form',
  templateUrl: './edit-tree-form.component.html',
  styleUrls: ['./edit-tree-form.component.css', '../../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TreeNameIsUniqueValidator],
})
export class EditTreeFormComponent extends TreeIdInheritable implements OnInit {
  private treeService = inject(TreeService);
  private treeNameIsUnique = inject(TreeNameIsUniqueValidator);
  readonly formGroup = new FormGroup<CoffeeTreeForm>({
    regularId: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.treeNameIsUnique.validate.bind(this.treeNameIsUnique)],
      nonNullable: true,
    }),
    species: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    startHeight: new FormControl(0, { validators: [Validators.min(1), Validators.required], nonNullable: true }),
  });
  readonly loading$ = new BehaviorSubject(false);
  readonly treeIdError$ = this.formGroup.statusChanges.pipe(
    filter((status) => status !== 'PENDING'),
    map(() => {
      return this.formGroup.controls.regularId.errors
        ? Boolean(this.formGroup.controls.regularId.errors['treeIdNotUnique'])
        : false;
    }),
  );
  @Output() submitted = new EventEmitter<void>();

  ngOnInit(): void {
    this.getFarmIdAreaIdAndTreeId()
      .pipe(
        mergeMap(([farmId, areaId, treeId]) => this.treeService.getTree(farmId, areaId, treeId)),
        first(),
      )
      .subscribe((tree) => {
        this.formGroup.controls.regularId.setValue(tree.regularId);
        this.formGroup.controls.species.setValue(tree.species);
        this.formGroup.controls.startHeight.setValue(tree.startHeight);
      });
  }

  handleSubmit() {
    if (this.loading$.value || this.formGroup.invalid) return;
    const regularId = this.formGroup.controls.regularId.value;
    const species = this.formGroup.controls.species.value;
    const startHeight = this.formGroup.controls.startHeight.value;
    this.loading$.next(true);
    this.getFarmIdAreaIdAndTreeId()
      .pipe(
        mergeMap(([farmId, areaId, treeId]) =>
          this.treeService.updateTree(farmId, areaId, treeId, { regularId, species, startHeight }),
        ),
        tap({ next: () => this.submitted.emit(), finalize: () => this.loading$.next(false) }),
      )
      .subscribe();
  }
}
