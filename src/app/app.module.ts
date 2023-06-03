import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataFormComponent } from './data-form/data-form.component';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { DataTableControlsComponent } from './data-table-controls/data-table-controls.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { NgxSliderModule } from 'ngx-slider-v2';
import { DpVsAprDataTableComponent } from './dp-vs-apr-data-table/dp-vs-apr-data-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaymentOverviewComponent } from './payment-overview/payment-overview.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SummaryCardComponent } from './summary-card/summary-card.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DiffTableComponent } from './diff-table/diff-table.component';
import { AdditionalSummaryComponent } from './additional-summary/additional-summary.component';
import { SummaryLineChartComponent } from './summary-line-chart/summary-line-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SummaryPieChartComponent } from './summary-pie-chart/summary-pie-chart.component';
import { SelectedSummaryComponent } from './selected-summary/selected-summary.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MonthlyOrTotalPipe } from './pipes/monthlyOrTotal/monthly-or-total.pipe';
import { MonthToWordsPipe } from './pipes/monthToWords/month-to-words.pipe';
import { InsightComponent } from './insight/insight.component';
import { DiffParamComponent } from './diff-param/diff-param.component';
import { DefaultCompactSummaryCardComponent } from './default-compact-summary-card/default-compact-summary-card.component';
import { InsightsContainerComponent } from './insights-container/insights-container.component';
import { RangeIndicatorComponent } from './range-indicator/range-indicator.component';
import { CompactLineChartComponent } from './compact-line-chart/compact-line-chart.component';
import { AmmortizationTableComponent } from './ammortization-table/ammortization-table.component';
import { MatTableModule } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [
    AppComponent,
    DataFormComponent,
    DataTableControlsComponent,
    AppHeaderComponent,
    DpVsAprDataTableComponent,
    PaymentOverviewComponent,
    SummaryCardComponent,
    DiffTableComponent,
    AdditionalSummaryComponent,
    SummaryLineChartComponent,
    SummaryPieChartComponent,
    SelectedSummaryComponent,
    MonthlyOrTotalPipe,
    MonthToWordsPipe,
    InsightComponent,
    DiffParamComponent,
    DefaultCompactSummaryCardComponent,
    InsightsContainerComponent,
    RangeIndicatorComponent,
    CompactLineChartComponent,
    AmmortizationTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    NgxSliderModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSlideToggleModule,
    NgxChartsModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatSliderModule,
    MatTableModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
