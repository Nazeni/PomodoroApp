import { Component, OnInit, ElementRef, ViewChild, DoCheck, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Pomodoro } from '../pomodoro-card/pomodoro.model';
import { PomodoroService } from 'src/app/shared/pomodoro.service';
import { trigger, state, style, animate, transition } from '@angular/animations'
import { TimerComponent } from '../timer/timer.component';
import { CdkDragDrop, DragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [
    trigger('openAddForm', [

      transition(':enter', [
        style({ transform: 'translate(0, -20%)' }),
        animate('50ms'),

      ]),
      transition(':leave', [
        animate('50ms', style({ transform: 'translate(0, 20%)' }))
      ])

    ])
  ]
})

export class MainLayoutComponent implements OnInit, DoCheck{

  showAddForm: boolean = false;
  showTasksDropdown: boolean = false;
  openNotearea: boolean = false;

  title!: string;
  est: number = 0;
  note!: string;
  act!: number;
  isDone!: boolean;
  pomodoro!: Pomodoro;
  index!: Pomodoro;
  estCount: number = 0;
  totalAct: any = 0;
  finishTime!: any;
  showEditForm!: boolean;
  pomodoros: Pomodoro[] = new Array<Pomodoro>();
  selectedPomodoro!: Pomodoro;
  showResults: boolean = false;
  item!: string;
  showSetting: boolean = false;
  turn: number = 0;
  
  pSecond:any = 1;
  shortSecond:any = 5;
  longSecond:any = 10;
  time!:number;

  @ViewChild('dropDown') el!: ElementRef;
  @ViewChild('timer') timer!: TimerComponent;

  @HostListener('document:click', ['$event']) onDocumentClick($event: any) {
    $event.stopPropagation();
    this.showTasksDropdown = false;
    console.log("none")
  }
  
  constructor(private pomodoroService: PomodoroService) {

    console.log("show storage:");
    this.selectedPomodoro = this.pomodoros[0];

  }
  
  ngOnInit(): void {

    this.pomodoro = new Pomodoro();
    this.pomodoros = this.pomodoroService.getPomodoros();
    this.pomodoro.est = 1;
    this.pomodoro.act = 0;
    this.pomodoro.isDone = false;
    this.showEditForm = false;
    this.getTitle();

  }
  // ngOnInit(): void {

  //   this.pomodoro = new Pomodoro();
  //   this.pomodoroService.getPomodoros()
  //     .subscribe(
       
  //       (data: Pomodoro[]) => this.pomodoros = data,
  //       (err: any) => console.log(err),
  //       () => console.log('All done getting pomodoros')

  //     )
  //   //this.pomodoros = this.pomodoroService.getPomodoros();
  //   this.pomodoro.est = 1;
  //   this.pomodoro.act = 0;
  //   this.pomodoro.isDone = false;
  //   this.showEditForm = false;
  //   this.getTitle();

  // }  / can i take your code on my machin 

  ngDoCheck() {
    this.results();
    console.log('show results');
    console.log("newV:", this.pSecond)
    console.log("setting chane:", this.showSetting);
    console.log("totalAct change in Main component:", this.totalAct);
  }

  getActChange(data:any){
    this.totalAct = data;
    this.selectedPomodoro.act +=1;
    this.turn += 1;
  }

  add() {

    this.showAddForm = true;

  }
 
  onFormSubmit(pomodoroForm: NgForm): void {
    console.log(pomodoroForm);
    this.setFinishTime(); // is not working after 3rd time

    this.pomodoroService.addPomodoros(pomodoroForm.value);
    //let newPomodoro: Pomodoro = <any>pomodoroForm.value;
    
    //this.pomodoroService.addPomodoros(newPomodoro)
      //.subscribe();
    this.estCount = Number(this.estCount) + Number(this.pomodoro.est);
    console.log('estValue', this.pomodoro.est);
    pomodoroForm.controls['est'].setValue('1');
    pomodoroForm.controls['title'].reset();
    if (this.openNotearea) pomodoroForm.controls['note'].reset();
    this.openNotearea = false;

  }
 
  setFinishTime() {
  
    let d = new Date();
    let ti = d.getHours() * 60 + d.getMinutes();
    console.log("NAZ test 1, time", ti);
    if (this.pomodoros.length > 0) {
      ti = ti + (this.shortSecond + this.longSecond);
      this.time = ti; 
      console.log("NAZ test if , time", this.time);
    }
      ti += this.pSecond;
      this.time = ti;
      console.log("NAZ test else, time", this.time);
    console.log("NAZ test 2, time", this.time, this.pSecond, this.shortSecond, this.longSecond)

  }
  
  showDropdown($event: any) {

    $event.stopPropagation();
    this.showTasksDropdown = !this.showTasksDropdown;

  }

  clearAllTasks() {

    this.pomodoroService.clearPomodoros(this.pomodoros);
    this.est = 0;
    console.log("clear all")

  }

  clearFinishedTasks() {

    this.pomodoros = this.pomodoroService.clearIsDone(this.pomodoros);
    console.log("clear finished tasks", this.pomodoros);

  }

  markedPomodoro(data: boolean) {

    this.isDone = data;
    console.log("recieved data", data);

  }

  getEstCount(data: number) {

    this.est = data;
    console.log('est Count data', data);
    console.log('est ', this.est);

    if (this.isDone === true) {

      this.estCount = +this.estCount - (+this.est);

    } else {

      this.estCount = +this.estCount + (this.est);

    }
    console.log('est Count ', this.estCount);

  }

  onSelect(pomodoro: Pomodoro) {

    this.selectedPomodoro = pomodoro;
    this.getTitle();

    console.log('selected pomodoro', this.selectedPomodoro)

  }

  getTitle() {

    this.selectedPomodoro ? this.item = this.selectedPomodoro.title : this.item = "Time to focus";
    console.log('hii');

  }

  results() {

    this.pomodoros.length !== 0 ? this.showResults = true : this.showResults = false;
    console.log(" Show Results", this.showResults)

  }

  openSetting(){
    this.showSetting = true;
  }

  getActDone(data:any){

    this.totalAct = data;
  }

  drop(event: CdkDragDrop<Pomodoro[]>){
    
    moveItemInArray(this.pomodoros, event.previousIndex, event.currentIndex);

  }
}
























