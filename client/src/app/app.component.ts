import { Component } from '@angular/core';
import { Test, TestService } from './services/test-services/test.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'TestChange';

  testValue: Observable<Test> = this.service.getTest();

  constructor (private service : TestService){};
}
