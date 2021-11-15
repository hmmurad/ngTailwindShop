import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css'],
})
export class EmployeeCardComponent implements OnInit {
  @Input() product;
  @Input() id;
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {}

  onDelete(id: string) {
    this.dashboardService.deleteProduct(id);
  }
}
