import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './public/components/language-switcher/language-switcher.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    LanguageSwitcherComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ManageWise';
  @ViewChild(MatSidenav, { static: true }) sidenav!: MatSidenav;

  options = [
    { path: '/project', title: 'Project' },
  ];

  otherOptions = [
    { icon: 'https://cdn-icons-png.flaticon.com/512/87/87578.png', path: '/statistics', title: 'Statistics' },
    { icon: 'https://i.imgur.com/X51XVUz.png', path: '/backlog', title: 'Backlog' },
    { icon: 'https://i.imgur.com/kP7elFc.png', path: '/board', title: 'Board' },
    { icon: 'https://i.imgur.com/xQxGLrm.png', path: '/issues', title: 'Reports' },
    { icon: 'https://i.imgur.com/XkRHbGU.png', path: '/members', title: 'Members' },
    { icon: 'https://i.imgur.com/n1IHpmx.png', path: '/meeting', title: 'Meeting' },
    { icon: 'https://i.imgur.com/GWdot6x.png', path: '/settings', title: 'Configuración' },
  ];

  constructor(
    private translate: TranslateService,
    private observer: BreakpointObserver
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.observer.observe(['(max-width: 1280px)']).subscribe((response) => {
      if (response.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
}
