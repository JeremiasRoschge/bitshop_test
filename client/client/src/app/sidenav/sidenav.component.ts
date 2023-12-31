import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener, SimpleChanges } from '@angular/core';
import { navbarData } from './nav-data';
import { navbarAdminData } from './nav-data-admin';
import { Router } from '@angular/router';
import {ServicesUserService} from "../services-user/services-user.service";

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms',
          style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('350ms',
          style({opacity: 0})
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {
  constructor( private router: Router, private userService: ServicesUserService ) {}

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  navAdminData = navbarAdminData
  userRole: string | null = 'empleado';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
      this.screenWidth = window.innerWidth;
      this.userRole  = this.getUserRole();

      console.log(this.navAdminData)

      this.userService.onUserRoleChange().subscribe((newRole) => {
        if(newRole){
          this.userRole = JSON.parse(newRole).role
          console.log(this.userRole)
        }
      });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes) {

    }
  }

  getUserRole(): string | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  logout() {
    sessionStorage.clear()
    this.router.navigate(['/'])
    this.userRole = "empleado"
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }



}
