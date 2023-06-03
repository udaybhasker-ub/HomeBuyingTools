import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataFormComponent } from './data-form/data-form.component';
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { DataTableControlsComponent } from './data-table-controls/data-table-controls.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { DpVsAprDataTableComponent } from './dp-vs-apr-data-table/dp-vs-apr-data-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { PaymentOverviewComponent } from './payment-overview/payment-overview.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SummaryCardComponent } from './summary-card/summary-card.component';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { DiffTableComponent } from './diff-table/diff-table.component';
import { AdditionalSummaryComponent } from './additional-summary/additional-summary.component';
import { SummaryLineChartComponent } from './summary-line-chart/summary-line-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SummaryPieChartComponent } from './summary-pie-chart/summary-pie-chart.component';
import { SelectedSummaryComponent } from './selected-summary/selected-summary.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MonthlyOrTotalPipe } from './pipes/monthlyOrTotal/monthly-or-total.pipe';
import { MonthToWordsPipe } from './pipes/monthToWords/month-to-words.pipe';
import { InsightComponent } from './insight/insight.component';
import { DiffParamComponent } from './diff-param/diff-param.component';
import { DefaultCompactSummaryCardComponent } from './default-compact-summary-card/default-compact-summary-card.component';
import { InsightsContainerComponent } from './insights-container/insights-container.component';
import { RangeIndicatorComponent } from './range-indicator/range-indicator.component';
import { CompactLineChartComponent } from './compact-line-chart/compact-line-chart.component';
import { AmmortizationTableComponent } from './ammortization-table/ammortization-table.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
