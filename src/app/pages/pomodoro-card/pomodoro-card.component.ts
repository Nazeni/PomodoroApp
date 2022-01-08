import { Component, OnInit, Input, Output, EventEmitter, Renderer2, OnChanges, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Pomodoro } from 'src/app/pages/pomodoro-card/pomodoro.model';
import { PomodoroService } from "src/app/shared/pomodoro.service"

@Component({
  selector: 'app-pomodoro-card',
  templateUrl: './pomodoro-card.component.html',
  styleUrls: ['./pomodoro-card.component.scss']
})
export class PomodoroCardComponent implements OnInit, OnChanges {

  @Input() title!: string;
  @Input() est!: number;
  @Input() act!: number;
  @Input() note!: string;
  @Input() showAddForm!: boolean;
  @Input() isDone: boolean = false;
  @Input() index!: Pomodoro;
  @Input() pomodoro!: Pomodoro;
  @Input() selectedPomodoro!: Pomodoro;
  @Input() pomodoros!: Pomodoro[];

  @Output('marked') markedEvent = new EventEmitter();
  @Output('getEst') estEvent = new EventEmitter();

  @ViewChild('editForm') el!: ElementRef;

  openNotearea: boolean = false;
  showEditForm: boolean = false;

  constructor(private renderer: Renderer2, private pomodoroService: PomodoroService) { }

  ngOnInit() {

    this.pomodoros = this.pomodoroService.getPomodoros();
  
  }
  // ngOnInit() {

  //   this.pomodoroService.getPomodoros()
  //     .subscribe(
         
  //       (data: Pomodoro[]) => this.pomodoros = data,
  //       (err: any) => console.log(err),
  //       () => console.log('All done getting pomodoros')
  //     )

  //   //this.pomodoros = this.pomodoroService.getPomodoros();
  
  // }

  ngOnChanges() {

    return this.showEditForm;
  }

  @HostListener('document:click', ['$event']) onDocumentClick($event: any) {

    //this.index.showEditForm = false;
    console.log("show Add Form onn HostListener:", this.showAddForm);

  }

  pomodoroEditForm!: NgForm;

  onEditPomodoro(pomodoroEditForm: NgForm, $event: any) {
    //$event.stopPropagation();
    this.pomodoros.forEach((x) => {

      if (x.showEditForm === true) {

        x.showEditForm = false;
        console.log("editForm True")
      }
    })

    if (this.showAddForm) this.showAddForm = true; //does not work
    this.index.showEditForm = true;
    pomodoroEditForm.value.isDone = this.index.isDone;
    pomodoroEditForm.value.title = this.index.title;
    pomodoroEditForm.value.est = this.index.est;

    //-----this part is not working------------------------ 
    if (this.index.note) {

      this.openNotearea = true;
      pomodoroEditForm.value.note = this.index.note;
    };
    ///-----------------------------------------------------
    console.log("OnEdit Form note:", this.index.note);
  }

  onMarkedPomodoro(item: Pomodoro) {

    this.isDone = !this.isDone;
    item.isDone = this.isDone;

    this.markedEvent.emit(this.isDone);

  }

  onGetEstCount(item: Pomodoro) {

    this.estEvent.emit(item.est);

  }

  OnFormUpdate(pomodoroEditForm: NgForm) {
    console.log(pomodoroEditForm);

    this.pomodoro = this.pomodoroService.update(this.index,
      pomodoroEditForm.value.title,
      pomodoroEditForm.value.est,
      pomodoroEditForm.value.noteArea);
      
    this.index.showEditForm = false;
    console.log("pomodoros after update:", this.pomodoros);

  }

  deletePomodoro(item: Pomodoro) {

    let index = this.pomodoroService.getIndex(item);
    this.pomodoros.splice(index, 1);
    if(this.isDone == false){
     
      this.estEvent.emit(item.est);
    }
      console.log("est count delete:", item.est);

    console.log("delete pomodoro:", item);
    console.log("after delete pomodoro", this.pomodoros);
  }

}
