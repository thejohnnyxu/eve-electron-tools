import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { ConfigService } from 'src/app/services/config.service';
import { ElectronService } from 'src/app/services/electron.service';
import { SuggestionService } from 'src/app/services/suggestion.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { UniverseService } from 'src/app/services/universe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Pre-load essential services so their startups don't impact performance
  constructor(private electron: ElectronService, private universe: UniverseService,
    private config: ConfigService, private alert: AlertService, private suggest: SuggestionService,
    private tracking: TrackingService, private changeDetector: ChangeDetectorRef) {
    // Watches for updates to state that occur in Electron-land and
    // signals Angular re-render the view.
    this.electron.updateOccured.subscribe((reason) => {
      if (reason) {
        console.log('Manual view update because of:', reason);
      }
      this.changeDetector.detectChanges();
    });
  }
}
