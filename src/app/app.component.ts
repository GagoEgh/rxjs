import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, interval, take, map, forkJoin, delay, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  constructor() {
  }
 
  ngOnInit(): void {
    this.getDate()
    this.changeDate()
    this.addObs();
    this.showValue({ id: 45 });
  }

  // Ստեղծել observable, որը ամեն վարկյանը մեկ emit կանի [1-10] թվերը։
  time = interval(1000);
  private getDate(): void {
    this.time
      .pipe(takeUntil(this.unsubscribe$),take(11))
      .subscribe((result: any) => {
        console.log(result)
      })
  }

  // Ստեղծել observable, որը ստանալով մի տիպի data, կփոխի այն և նոր emit կանի`
  // { id: number, firstName: string, lastName: string }  ⇒  { id: number, fullName: string }
  // fullName-ը firstName-ից ու lastName-ից է կազմված

  user = of({
    id: 1,
    firstName: 'Manuel',
    lastName: 'Noer'
  })


  changeDate() {
    this.user.pipe(takeUntil(this.unsubscribe$),
    map((us) => {
      const obj = { id: us.id, fullName: us.firstName + ' ' + us.lastName }
      return obj
    })).subscribe((res) => {
      console.log(res)
    })
  }


  // Ստեղծել Obs4 անունով observable,
  // որը կսպասի 3 այլ observable-ների և միանգամից emit կանի նրանց բոլորը value - ները՝
  // Obs1: emits 42
  // Obs2: emits “hello world”
  // Obs3: emits { name: ‘test’, age: 20 }
  // Obs4: [42, “hello world”, { name: ‘test’, age: 20 }] կամ { obs1: 42, obs2: “hello world”, obs3: { name: ‘test’, age: 20 } }


  Obs1 = of(42);
  Obs2 = of('hello world');
  Obs3 = of({ name: 'test', age: 20 });
  Obs4 = [this.Obs1, this.Obs2, this.Obs3];

  private addObs(): void {
    forkJoin(this.Obs4).pipe(takeUntil(this.unsubscribe$))
    .subscribe((res) => {
      console.log('fork ', res)
    })
  }

  // Ստեղծել observable, որը տրված value-ն emit կանի 3 վայրկյան հետո
  showValue(value: any) {
    const secondsLater = of(value)
    secondsLater.pipe(takeUntil(this.unsubscribe$),delay(3000))
      .subscribe((res) => {
        console.log(res)
      })

  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}


