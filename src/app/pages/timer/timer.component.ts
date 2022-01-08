import { Input, Output, Component, OnInit, EventEmitter, ElementRef, DoCheck, ViewChild } from '@angular/core';
import { Pomodoro } from 'src/app/pages/pomodoro-card/pomodoro.model';
import { PomodoroService } from 'src/app/shared/pomodoro.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})

export class TimerComponent implements OnInit, DoCheck {
  @Input() selectedPomodoro!: Pomodoro;
  @Input() pSecond:any;
  @Input() shortSecond:any;
  @Input() longSecond:any;

  @Output() totalActChange = new EventEmitter(); 

  @ViewChild('timerButtons') el!: ElementRef;
  @ViewChild('thickLine') elLine!: ElementRef;

  intervalId: any = 0;
  second:any = 1;
  changeButton: boolean = false;
  selected!: string;
  list: any;
  showTime :number = 0;
  totalAct: any = 0;


  constructor(private elementRef: ElementRef , public _pomodoroService : PomodoroService) {
  
    this.list = ["Pomodoro", "Short Break", "Long Break"];
    this.selected = this.list[0];

  }

  ngOnInit() {
    this.showTime = this.second * 60;
   }

  ngDoCheck() {
    this.checkSelectOption();
    console.log("changed second:", this.pSecond);
    console.log("short changed second:", this.shortSecond);
    console.log(" long changed second:", this.longSecond);
    
  }

  startTimer() {
    
    this.changeButton = true;
    this.countDown( this.second);
    this.elLine.nativeElement.style.width = "100%";
    let x = this.showTime;
    console.log("Naz X:", x);
    let c = "width " + x + 's' + ' ' + 'linear';
    this.elLine.nativeElement.style.transition = c;

  }

  stopTimer() {

    this.changeButton = false;
    this.clearTimer();
    let w = this.elLine.nativeElement.offsetWidth;
    this.elLine.nativeElement.style.width = w + 'px';
    this.elLine.nativeElement.style.transition = "width 0s linear";

  }

  clearTimer() {
    clearInterval(this.intervalId);
  }

  clearTimeLine() {

    this.elLine.nativeElement.style.width = "0%";
    this.elLine.nativeElement.style.transition = "width 0s linear";

  }
  
  countDown(second: any) {
    second = second * 60;
    
    this.clearTimer();
    this.intervalId = window.setInterval(() => {

      second = second - 1;
      console.log("second minus one", second);
      this.showTime = second;
      if (second < 0) {
        this.outputAct();
        
        console.log(" add total act:", this.totalAct);
        
        this.clearTimer();
        this.playAudio();
        this.switchTimerOptions();
        console.log("destroyed");

      }  
    }, 1000)
  }

  outputAct(){
    this.totalAct += 1;
    this.totalActChange.emit(this.totalAct);
  }

  playForeward() {

    let x = confirm(`Are you sure you want to finish the round early? 
                    (The remaining time will not be counted in the report.)`)
    if (x === true) {

      this.clearTimer();
      this.clearTimeLine();
      this.switchTimerOptions();

    }
  }

  switchTimerOptions() {
    switch (this.selected) {

      case "Pomodoro":
        this.selected = "Short Break";
        this.second = this.shortSecond;
        this.showTime =this.second*60;
        console.log("ART TEST",this.selected, this.second, this.showTime)
        this.break(this.second, "#4C9195");
        break;

      case "Short Break":
        this.selected = "Long Break";
        this.second = this.longSecond;
        this.showTime =this.second*60;
        console.log("ART TEST",this.selected, this.second, this.showTime)
        this.break(this.second, "#457CA3");
        console.log("change to long break");
        break;


      case "Long Break":
        this.selected = "Pomodoro";
        this.second = this.pSecond
        this.showTime =this.second*60;
        console.log("ART TEST",this.selected, this.second, this.showTime)
        this.pomodoro(this.second, "#D95550");
        console.log("change to pomodoro");
        break;
    }
  }

  pomodoro(second: number, color: any) {

    this.break(second, color);
    console.log("pomodoro active")

  }

  shortBreak(second: number, color: any) {
    this.break(second, color)
    console.log("pomodoro active")
  }

  longBreak(second: number, color: any) {
    this.break(second, color)
  }

  break(second: number, color: any) {

    this.second = second;
    this.changeButton = false;
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = color;
    this.el.nativeElement.style.color = color;

  }

  select(item: string) {

    this.selected = item;
    this.clearTimer();
    this.clearTimeLine();
    switch (this.selected) {

      case "Pomodoro": {
        
        console.log("ART TEST",this.selected, this.second, this.showTime)
        this.second = this.pSecond;
        this.showTime =this.second*60;

        this.break(this.pSecond, "#D95550");
        console.log("select pomodoro function");
        console.log("after select pomodoro function:", this.second);
        break;
      }
      case "Short Break": {
        
        console.log("ART TEST",this.selected, this.second, this.showTime)
        this.second = this.shortSecond;
        this.showTime =this.second*60;

        this.break(this.shortSecond, "#4C9195");
        console.log("select short break function");
        console.log("after select short break function:", this.shortSecond);
        break;
      }
      case "Long Break": {
        console.log("ART TEST",this.selected, this.second, this.showTime)
        this.second = this.longSecond;
        this.showTime =this.second*60;
        
        this.break(this.longSecond, "#457CA3");
        console.log("call long break function");
        break;
      }
    }
    console.log("selected Timer option", this.selected, item)
  }

  checkSelectOption() {

    switch (this.selected) {

      case "Pomodoro": {
        this.second = this.pSecond;
        break;
      }
      case "Short Break": {
        this.second = this.shortSecond;
        break;
      }
      case "Long Break": {
        this.second = this.longSecond;
        break;
      }
    }
  }

  isActive(item: string) {
    return this.selected === item;
  }

  playAudio() {

    let audio: HTMLAudioElement = new Audio('/../../../assets/sounds/alarm.wav');
    audio.play();
    console.log("audio")

  }

  playAudioClick() {

    let audio: HTMLAudioElement = new Audio('/../../../assets/sounds/click.wav');
    audio.play();
    console.log("audio click")

  }
}

























// import { Input, Component, OnInit, ElementRef, DoCheck, ViewChild } from '@angular/core';
// import { Pomodoro } from 'src/app/pages/pomodoro-card/pomodoro.model';
// import { PomodoroService } from 'src/app/shared/pomodoro.service';


// @Component({
//   selector: 'app-timer',
//   templateUrl: './timer.component.html',
//   styleUrls: ['./timer.component.scss']
// })

// export class TimerComponent implements OnInit, DoCheck {
//   @Input() selectedPomodoro!: Pomodoro;
//   @Input() pSecond:any;
//   @Input() shortSecond:any;
//   @Input() longSecond:any;

//   @ViewChild('timerButtons') el!: ElementRef;
//   @ViewChild('thickLine') elLine!: ElementRef;

//   intervalId: any = 0;
//   changeButton: boolean = false;
//   selected!: string;
//   list: any;
//   second:number = 10;
//   showTime: number = 0;

//   constructor(private elementRef: ElementRef , public _pomodoroService : PomodoroService) {
  
//     this.list = ["Pomodoro", "Short Break", "Long Break"];
//     this.selected = this.list[0];

//   }

//   ngOnInit() {
//     this.showTime = this.second * 60;
//    }

//   ngDoCheck() {
//     this.checkSelectOption(); 
//     console.log("changed second:", this.pSecond);
//     console.log("short changed second:", this.shortSecond);
//     console.log(" long changed second:", this.longSecond);
    
//   }

//   startTimer() {
    
//     this.changeButton = true;
//     this.countDown( this.second);
//     this.elLine.nativeElement.style.width = "100%";
//     let x = this.second;
//     let c = "width " + x + 's' + ' ' + 'linear';
//     this.elLine.nativeElement.style.transition = c;

//   }

//   stopTimer() {

//     this.changeButton = false;
//     this.clearTimer();
//     let w = this.elLine.nativeElement.offsetWidth;
//     this.elLine.nativeElement.style.width = w + 'px';
//     this.elLine.nativeElement.style.transition = "width 0s linear";

//   }

//   clearTimer() {
//     clearInterval(this.intervalId);
//   }

//   clearTimeLine() {

//     this.elLine.nativeElement.style.width = "0%";
//     this.elLine.nativeElement.style.transition = "width 0s linear";

//   }
  
//   countDown(second: any) {
//     second = second * 60;
    
//     this.clearTimer();
//     this.intervalId = window.setInterval(() => {

//       second = second - 1;
//       console.log("second minus one", second);
//       this.showTime = second;
//       if (second < 0) {

//         this.clearTimer();
//         this.playAudio();
//         this.switchTimerOptions();
//         console.log("destroyed");

//       }  
//     }, 1000)
//   }

//   playForeward() {

//     let x = confirm(`Are you sure you want to finish the round early? 
//                     (The remaining time will not be counted in the report.)`)
//     if (x === true) {
//       this.clearTimer();
//       this.clearTimeLine();
//       this.switchTimerOptions();
//     }
//   }

//   switchTimerOptions() {
//   debugger;
//     switch (this.selected) {

//       case "Pomodoro":
//         this.selected = "Short Break";
//         this.second = this.shortSecond;
//         this.showTime = this.second*60;
//         console.log("ART TEST", this.selected, this.second, this.showTime)
        
//         this.break(this.second, "#4C9195");
//         break;

//       case "Short Break":
//         this.selected = "Long Break";
//         this.second = this.longSecond;
//         this.showTime = this.second*60;
//         console.log("ART TEST", this.selected, this.second, this.showTime)
        
//         this.break(this.second, "#457CA3");
//         console.log("change to long break");
//         break;

//       case "Long Break":
//         this.selected = "Pomodoro";
//         this.second = this.pSecond
//         this.showTime = this.second*60;
//         console.log("ART TEST",this.selected, this.second, this.showTime)

//         this.pomodoro(this.second, "#D95550");
//         console.log("change to pomodoro");
//         break;
//     }
//   }

//   pomodoro(second: number, color: any) {
//     this.break(second, color);
//     console.log("pomodoro active")
//   }

//   shortBreak(second: number, color: any) {
//     this.break(second, color)
//     console.log("pomodoro active")
//   }

//   longBreak(second: number, color: any) {
//     this.break(second, color)
//   }

//   break(second: number, color: any) {

//     this.second = second;
//     this.showTime = this.second;
//     this.changeButton = false;
//     this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = color;
    
//     //this.elementRef.nativeElement.html.style.backgroundColor = color;
//     this.el.nativeElement.style.color = color;

//   }

//   select(item: string) {
//     debugger
//     this.selected = item;
//     this.clearTimer();
//     this.clearTimeLine();
//     switch (this.selected) {

//       case "Pomodoro": {
        
//         console.log("ART TEST",this.selected, this.second, this.showTime)
//         this.second = this.pSecond;
//         this.showTime = this.second*60;

//         this.break(this.pSecond, "#D95550");
//         console.log("select pomodoro function");
//         console.log("after select pomodoro function:", this.second);
//         break;
//       }
//       case "Short Break": {
        
//         console.log("ART TEST", this.selected, this.second, this.showTime)
//         this.second = this.shortSecond;
//         this.showTime = this.second*60;

//         this.break(this.shortSecond, "#4C9195");
//         console.log("select short break function");
//         console.log("after select short break function:", this.shortSecond);
//         break;

//       }
//       case "Long Break": {
        
//         console.log("ART TEST",this.selected, this.second, this.showTime)
//         this.second = this.longSecond;
//         this.showTime = this.second*60;

//         this.break(this.longSecond, "#457CA3");
//         console.log("call long break function");
//         break;
//       }
//     }

//     console.log("selected Timer option", this.selected, item)
//   }

//   checkSelectOption() {

//     switch (this.selected) {

//       case "Pomodoro": {
//         this.showTime = this.pSecond * 60;
//         break;
//       }
//       case "Short Break": {
//         this.showTime = this.shortSecond * 60;
//         break;
//       }
//       case "Long Break": {
//         this.showTime = this.longSecond * 60;
//         break;
//       }
//     }
//   }

//   isActive(item: string) {
//     return this.selected === item;
//   }

//   playAudio() {
//     let audio: HTMLAudioElement = new Audio('/../../../assets/sounds/alarm.wav');
//     audio.play();
//     console.log("audio")
//   }

//   playAudioClick() {
//     let audio: HTMLAudioElement = new Audio('/../../../assets/sounds/click.wav');
//     audio.play();
//     console.log("audio click");
//   }
// }



// export class TimerComponent implements OnInit, DoCheck {

//   @Input() selectedPomodoro!: Pomodoro;

//   @ViewChild('timerButtons') el!: ElementRef;
//   @ViewChild('thickLine') elLine!: ElementRef;

//   intervalId: any = 0;
//   minute: any = 1;
//   //second: any = String("0" + 0);
//   second: any = 100;
//   addZeroM: boolean = true;
//   addZeroS: boolean = true;

//   changeButton: boolean = false;

//   selected!: string;
//   list: any;

//   constructor(private elementRef: ElementRef) {

//     this.list = ["Pomodoro", "Short Break", "Long Break"];
//     this.selected = this.list[0];

//   }

//   ngOnInit() { }

//   ngDoCheck() {

//     this.minute.toString().length < 2 ? this.addZeroM = false : this.addZeroM = true;
//     this.second.toString().length < 2 ? this.addZeroS = false : this.addZeroS = true;
//     console.log('minute:', this.minute);

//   }

//   startTimer() {

//     this.changeButton = true;
//     this.countDown(this.minute, this.second);
//     this.elLine.nativeElement.style.width = "100%";
//     let x = ((this.minute * 10) + (+this.second)).toString();
//     let c = "width " + x + 's' + ' ' + 'linear';
//     this.elLine.nativeElement.style.transition = c;

//   }

//   stopTimer() {

//     this.changeButton = false;
//     this.clearTimer();
//     let w = this.elLine.nativeElement.offsetWidth;
//     this.elLine.nativeElement.style.width = w + 'px';
//     this.elLine.nativeElement.style.transition = "width 0s linear";

//   }

//   clearTimer() {

//     clearInterval(this.intervalId);

//   }

//   clearTimeLine() {

//     this.elLine.nativeElement.style.width = "0%";
//     this.elLine.nativeElement.style.transition = "width 0s linear";

//   }

//   countDown(minute: number, second: number) {

//     this.clearTimer();
//     this.minute = minute;
//     this.intervalId = window.setInterval(() => {

//       this.second -= 1;

//       if (this.second < 0) {

//         this.second = 10;
//         this.minute--;

//       } else if (this.minute === 0 && this.second === 0) {

//         this.clearTimer();
//         this.playAudio();
//         this.switchTimerOptions();
//         console.log("destroyed");

//       }

//     }, 1000)
//   }

//   playForeward() {

//     let x = confirm(`Are you sure you want to finish the round early? 
//                     (The remaining time will not be counted in the report.)`)
//     if (x === true) {

//       this.clearTimer();
//       this.clearTimeLine();
//       this.switchTimerOptions();

//     }
//   }

//   switchTimerOptions() {

//     switch (this.selected) {

//       case "Pomodoro":
//         this.selected = "Short Break";
//         this.second = String("0" + 0);
//         this.break(5, "#4C9195");
//         break;

//       case "Short Break":
//         this.selected = "Long Break";
//         this.second = String("0" + 0);
//         this.break(10, "#457CA3");
//         console.log("change to long break");
//         break;


//       case "Long Break":
//         this.selected = "Pomodoro";
//         this.second = String("0" + 0);
//         this.pomodoro(2, "#D95550");
//         console.log("change to pomodoro");
//         break;

//     }

//   }

//   pomodoro(minute: number, color: any) {

//     this.break(minute, color);
//     console.log("pomodoro active")

//   }

//   shortBreak(minute: number, color: any) {

//     this.break(minute, color)
//     console.log("pomodoro active")

//   }

//   longBreak(minute: number, color: any) {

//     this.break(minute, color)

//   }

//   break(minute: number, color: any) {

//     this.minute = minute;
//     this.changeButton = false;
//     this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = color;
    
   
//     //this.elementRef.nativeElement.html.style.backgroundColor = color;
//     this.el.nativeElement.style.color = color;

//   }

//   select(item: string) {

//     this.selected = item;
//     this.clearTimer();
//     this.clearTimeLine();
//     switch (this.selected) {

//       case "Pomodoro": {

//         this.pomodoro(0, "#D95550");
//         this.second = String("0" + 0);
//         console.log("call pomodoro function");
//         break;
//       }
//       case "Short Break": {
//         this.break(5, "#4C9195");
//         this.second = String("0" + 0);
//         console.log("call short break function");
//         break;

//       }
//       case "Long Break": {
//         this.break(10, "#457CA3");
//         this.second = String("0" + 0);
//         console.log("call long break function");
//         break;
//       }

//     }

//     console.log("selected Timer option", this.selected, item)
//   }

//   isActive(item: string) {

//     return this.selected === item;
//   }

//   playAudio() {

//     let audio: HTMLAudioElement = new Audio('/../../../assets/sounds/alarm.wav');
//     audio.play();
//     console.log("audio")

//   }

//   playAudioClick() {

//     let audio: HTMLAudioElement = new Audio('/../../../assets/sounds/click.wav');
//     audio.play();
//     console.log("audio click")

//   }
// }















//this.list = [{
                // name:"Pomodoro",
                // act: this.pomodoro(2, 2, "red")
            //   },
            //   {
            //     name:"Short Braek",
            //     act: this.shortBreak(5, 5, "blue")
            //   },
            //   { 
            //     name:"Long Braek",
            //     act: this.longBreak(10, 10, "green")
            //   }];

            //   this.list[0].act =  this.pomodoro(2, 2, "red");
            //   this.list[1].act = this.shortBreak(5, 5, 'blue');
            // }]

// shortBreak(minute:number, second:number, color:any){

  //   this.break(minute, second, color);
  //   //this.longBreak(10, 10,  "#457CA3");

  //   console.log("short break");

  // }

  // longBreak(minute: number, second: number, color:any){

  //   this.break(minute, second, color);

  // }
