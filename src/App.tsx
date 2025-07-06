import { DetailRow, GridComponent, GridModel, Inject, Page } from '@syncfusion/ej2-react-grids';
import { ChangeEventArgs, SliderComponent, SliderTickRenderedEventArgs } from '@syncfusion/ej2-react-inputs';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, AxesDirective, AxisDirective, IAccPointRenderEventArgs, IAxisLabelRenderEventArgs, PieSeries, StackingColumnSeries } from '@syncfusion/ej2-react-charts';
import { ChartComponent, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective } from '@syncfusion/ej2-react-charts';
import { DateTime, Tooltip } from '@syncfusion/ej2-react-charts';
import { closest, Internationalization } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import './index.css';
import './styles.css';
import { useEffect, useRef, useState } from 'react';

export default function App() {

  const [loanTicks, setLoanTicks] = useState({});
  const [dateValue, setDateValue] = useState(new Date());
  const [interestValue, setInterestValue] = useState(5.5);
  const [yearTenure, setYearTenure] = useState(true);
  let emiAmt: string = '';
  let principalAmt: string = '';
  let interestAmt: string = '';
  let totalAmt: string = '';
  const [principalValue, setPrincipalValue] = useState(300000);
  const [loanValue, setLoanValue] = useState(15);
  let grid = useRef(null);
  let accChart = useRef(null);
  let acc1 = useRef(null);
  let principalNumRef = useRef(null);
  let principalSliderRef = useRef(null);
  let interestSliderRef = useRef(null);
  let interestNumRef = useRef(null);
  let loanSliderRef = useRef(null);
  let loanNumRef = useRef(null);
  let pie = useRef(null);
  let emi: number = 0;
  let tempPrincipalValue: number = 0;
  let beginBalance: number = 30000;
  let tent: number = 0;
  let totalPrincipalYear: number = 0;
  let totalInterestYear: number = 0;
  let tempInterest: number = 0;
  let dataUnits: Array<Object> = [];
  let yearWiseData: Array<Object> = [];
  let dateObj: Date = new Date();
  let totalInterest: number = 0;
  let totalAmount: number = 0;
  let totalPrincipal: number = 0;
  let endBalance: number = 0;
  let yearTotal: number = 0;
  let child: GridModel;
  let interestNumFormat: string = '#.##\' %\'';
  let loanNumFormat: string = '#.##';
  let monthNames: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  let intl: Internationalization = new Internationalization();
  let legendSettings: Object = {
    textStyle: {
      color: '#FFFFFF',
      fontFamily: 'Raleway, sans-serif',
      fontWeight: '600',
      opacity: 0.62,
      size: '16px',
    }
  };
  let format: string = 'c0';
  let principalTicks: Object = { placement: 'After', largeStep: 100000, smallStep: 10000, showSmallTicks: false, format: 'c0' };
  const [interestTicks, setInterestTicks] = useState({});
  let labelStyle: any;
  let titleStyle: any;
  let columns: any;
  const [loanNumMinValue, setLoanNumMinValue] = useState(1);
  const [loanNumMaxValue, setLoanNumMaxValue] = useState(40);
  const [loanMaxValue, setLoanMaxValue] = useState(40);
  const [loanNumStep, setLoanNumStep] = useState(1);
  const [loanStep, setLoanStep] = useState(1);
  const [loanMinValue, setLoanMinValue] = useState(0);
  let princAmount = useRef(null);
  let totalInt = useRef(null);
  let totalPay = useRef(null);
  let monPayment = useRef(null);
  let monthChange = useRef(null);
  let yearChange = useRef(null);
  const [paymentHideAtMedia, setPaymentHideAtMedia] = useState('(min-width: 480px)');

  function setInitValues(): void {
    emi = calculateEMI();
    tempPrincipalValue = principalValue;
    tent = yearTenure ? (loanValue * 12) : loanValue;
    dataUnits = [];
    yearWiseData = [];
    dateObj = new Date(dateValue.getTime());
    totalInterest = 0;
    totalAmount = 0;
    totalPrincipal = 0;
    totalPrincipalYear = 0;
    totalInterestYear = 0;
    emiAmt = getCurrencyVal(tent ? Math.round(emi) : 0);
    interestAmt = getCurrencyVal(tent ? Math.round((emi * tent) - tempPrincipalValue) : 0);
    totalAmt = getCurrencyVal(tent ? Math.round((emi * tent)) : 0);
    principalAmt = getCurrencyVal(tempPrincipalValue);
  }

  function calculateEMI(): number {
    let interestValue: number = getInterest();
    let tent: number = yearTenure ? (loanValue * 12) : loanValue;
    if (interestValue) {
      return principalValue * interestValue *
        (Math.pow((1 + interestValue), tent)) / ((Math.pow((1 + interestValue), tent)) - 1);
    }
    return principalValue / tent;
  }

  function getInterest(): number {
    return interestValue ? parseFloat('' + interestValue / 12 / 100) : 0;
  }

  function getCurrencyVal(value: number): string {
    return intl.formatNumber(value, { format: 'C0' });
  }

  function principalRenderedTicks(args: SliderTickRenderedEventArgs): void {
    let li: HTMLCollectionBase = args.ticksWrapper.getElementsByClassName('e-large');
    for (let i: number = 0; i < li.length; ++i) {
      let ele: HTMLElement = (li[i].querySelectorAll('.e-tick-value')[0] as HTMLElement);
      let num: number = parseInt(ele.innerText.substring(1).replace(/,/g, ''), 10) / 1000;
      ele.innerText = num === 0 ? ('' + num) : (num + 'K');
    }
  }

  const principalNumChange = (args: any): void => {
    (principalSliderRef.current as any).value = args.value
    setPrincipalValue(args.value);
  }

  const principalChanged = (args: any): void => {
    (principalNumRef.current as any).value = args.value
    setPrincipalValue(args.value);
  }

  const interestNumChange = (args: any): void => {
    (interestSliderRef.current as any) = args.value
    setInterestValue(args.value);
  }

  const interestChanged = (args: any): void => {
    (interestNumRef.current as any).value = args.value
    setInterestValue(args.value);
  }

  const loanNumChange = (args: any): void => {
    (loanSliderRef.current as any).value = args.value;
    setLoanValue(args.value);
  }

  const loanChanged = (args: any): void => {
    (loanNumRef.current as any).value = args.value;
    setLoanValue(args.value);
  }

  const updateDateValue = (args: any): void => {
    dateObj = args.value

    if (isNOU(args.value)) {
      setDateValue(new Date());
    } else {
      setDateValue(args.value);
    }
  }

  function monthChanged(args: ChangeEventArgs): void {
    setYearTenure(false);
    setLoanNumMinValue(12);
    setLoanNumMaxValue(480);
    setLoanNumStep(12);
    setLoanMaxValue(480);
    setLoanValue(loanValue * 12);
    setLoanStep(12);
    setLoanTicks({ placement: 'After', largeStep: 120, smallStep: 12, showSmallTicks: false });
  }

  function yearChanged(args: ChangeEventArgs): void {
    setYearTenure(true);
    setLoanNumMinValue(1);
    setLoanNumMaxValue(40);
    setLoanNumStep(1);
    setLoanMaxValue(40);
    setLoanValue(loanValue / 12);
    setLoanStep(1);
    setLoanTicks({ placement: 'After', largeStep: 10, smallStep: 1, showSmallTicks: false });

  }

  function axisLabelRender(args: IAxisLabelRenderEventArgs): void {
    if (window.innerWidth < 576) {
      if (args.axis.name === 'primaryYAxis' || args.axis.name === 'yAxis1') {
        let value: number = Number(args.value) / 1000;
        args.text = value === 0 ? String(value) : (String(value) + 'K');
      }
    }
  }

  function calRangeValues(): void {
    for (let i: number = 0; i < tent; i++) {
      tempInterest = getInterest() ? (tempPrincipalValue * getInterest()) : tempPrincipalValue;
      totalInterest += tempInterest;
      totalAmount += emi;
      totalPrincipal += parseFloat((emi - tempInterest).toFixed(2));
      endBalance = tempPrincipalValue - (emi - tempInterest);
      yearTotal += emi;
      totalPrincipalYear += parseFloat((emi - tempInterest).toFixed(2));
      totalInterestYear += tempInterest;
      dataUnits.push({
        month: monthNames[dateObj.getMonth()],
        index: (i + 1),
        totalInterest: Math.round(totalInterest),
        totalAmount: totalAmount,
        emi: Math.round(emi),
        year: dateObj.getFullYear(),
        beginningBalance: Math.round(tempPrincipalValue),
        interest: Math.round(tempInterest),
        principalPaid: Math.round((emi - tempInterest)),
        endingBalance: Math.round(endBalance)
      });
      if (i === 0 || dateObj.getMonth() === 0) {
        beginBalance = tempPrincipalValue;
      }
      if (dateObj.getMonth() === 11 || (i === tent - 1)) {
        yearWiseData.push({
          beginningBalance: Math.round(beginBalance),
          totalInterest: Math.round(totalInterest),
          totalPrincipal: Math.round(totalPrincipal),
          totalAmount: Math.round(totalAmount),
          yearTotal: Math.round(yearTotal),
          endingBalance: Math.round(endBalance),
          yearN: new Date(dateObj.getFullYear(), 0, 1),
          year: dateObj.getFullYear(),
          yearPrincipal: totalPrincipalYear,
          yearInterest: totalInterestYear
        });
        yearTotal = 0;
        totalPrincipalYear = 0;
        totalInterestYear = 0;
      }
      tempPrincipalValue = endBalance;
      if (i < tent - 1) {
        dateObj.setMonth(dateObj.getMonth() + 1);
      }
    }
  }

  function gridTemplate(props: any): any {
    return (
      <div>
        <div className="e-icons e-icon-grightarrow e-row-toggle"></div>
        <span id="abc">{props.year}</span>
      </div>
    );
  }

  function onclickEvent(args: any) {
    debugger;
    let target: any = args.target as Element;
    if (target.classList.contains('e-row-toggle') || target.parentElement.querySelector('.e-row-toggle')) {
      target = target.parentElement.querySelector('.e-row-toggle') ? target.parentElement.querySelector('.e-row-toggle') : target;
      if (target.classList.contains('e-icon-gdownarrow')) {
        target.classList.remove('e-icon-gdownarrow');
        target.classList.add('e-icon-grightarrow');
        (grid.current as any).detailRowModule.collapse(parseInt((closest(target, 'tr') as HTMLElement).getAttribute('aria-rowindex'), 10)-1);
      } else {
        target.classList.remove('e-icon-grightarrow');
        target.classList.add('e-icon-gdownarrow');
        (grid.current as any).detailRowModule.expand(parseInt((closest(target, 'tr') as HTMLElement).getAttribute('aria-rowindex'), 10)-1);
      }
    }
  }

  function pointRender(args: IAccPointRenderEventArgs): void {
    if (args.point.index) {
      args.border.width = 7;
      args.fill = 'url(#interest_svg)';
    } else {
      args.border.width = 7;
      args.border.color = '#162036';
      args.fill = 'url(#principal_svg)';
    }
  }
  
  columns = [
    {
      headerText:'Year',
      template: gridTemplate,
      minWidth: '80px',
      textAlign:'Center',
    },
    {
      field:'yearTotal',
      headerText:'Payment',
      minWidth:'80px',
      format:format,
      textAlign:'Center',
      hideAtMedia:paymentHideAtMedia,
    },
    {
      field:'yearPrincipal',
      headerText:'Principal Paid',
      minWidth:'80px',
      format:format,
      textAlign:'Center',
    },
    {
      field:'yearInterest',
      headerText:'Interest Paid',
      minWidth:'80px',
      format:format,
      textAlign:'Center',
    },
    {
      field:'endingBalance',
      headerText:'Balance',
      minWidth:'80px',
      format:format,
      textAlign:'Center',
    }
  ]
  setInitValues();
  calRangeValues();
  child = {
    queryString: 'year',
    cssClass: "child-grid-custom",
    columns: [
      { field: 'month', headerText: 'Month', textAlign: 'Center', minWidth: '80px' },
      { field: 'emi', headerText: 'Payment', textAlign: 'Center', format: 'C0', minWidth: '80px' },
      { field: 'principalPaid', headerText: 'Principal Paid', textAlign: 'Center', format: 'C0', minWidth: '80px' },
      { field: 'interest', headerText: 'Interest Paid', textAlign: 'Center', format: 'C0', minWidth: '80px' },
      { field: 'endingBalance', headerText: 'Balance', textAlign: 'Center', format: 'C0', minWidth: '80px' }
    ],
    dataSource: dataUnits
  };

  labelStyle = {
    color: '#989CA9',
    fontFamily: 'Roboto',
    fontWeight: '400',
    size: '16px',
  };

  titleStyle = {
    color: '#FFFFFF',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: '600',
    opacity: 0.62,
    size: '16px',
  }

  let width = window.innerWidth;
  if (width <= 350) {
    labelStyle = {
      color: '#989CA9',
      fontFamily: 'Roboto',
      fontWeight: '400',
      size: '12px',
    }

    titleStyle = {
      color: '#FFFFFF',
      fontFamily: 'Raleway, sans-serif',
      fontWeight: '600',
      opacity: 0.62,
      size: '12px',
    }
  }
  useEffect(() => {
    setLoanTicks({
      placement: 'After',
      largeStep: 10,
      smallStep: 1,
      showSmallTicks: false
    });

    setInterestTicks({ placement: 'After', largeStep: 5, smallStep: 1, showSmallTicks: false });
  },[]);
  
  return (
    <div>
      <h1 className="header-style">Loan Calculator</h1>
      <div className="container main-content" id="content">
        <div className="row left-content-wrap">
          <div className="row loan-content" >
            <div className="left-content col-lg-12">
              <div className="row form-space" >
                <div className="col-lg-12">
                  <div className="content-space">
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <label className="principal">Loan Amount</label>
                          </td>
                          <td>
                            <div className="editor-space">
                              <NumericTextBoxComponent
                                id="principal_txt"
                                format='c0'
                                min={1000}
                                max={5000000}
                                value={principalValue}
                                step={10000}
                                width='200px'
                                change={principalNumChange}
                                ref={principalNumRef}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div >
                  <SliderComponent
                    id='principal'
                    min={0}
                    max={500000}
                    step={10000}
                    value={principalValue}
                    type='MinRange'
                    ticks={principalTicks}
                    renderedTicks={principalRenderedTicks}
                    ref={principalSliderRef}
                    change={principalChanged}
                  />
                </div>
              </div>
              <div className="row form-space">
                <div className="col-lg-12">
                  <div className="content-space">
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <label className="interestrate">Interest Rate</label>
                          </td>
                          <td>
                            <div className="editor-space">
                              <NumericTextBoxComponent
                                id="interest_txt"
                                format={interestNumFormat}
                                min={0}
                                max={20}
                                value={interestValue}
                                step={.25}
                                width='165px'
                                change={interestNumChange}
                                ref={interestNumRef}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <SliderComponent
                      id='interestrate'
                      min={0}
                      max={20}
                      step={.25}
                      value={interestValue}
                      type='MinRange'
                      ticks={interestTicks}
                      change={interestChanged}
                      ref={interestSliderRef}
                    />
                  </div>
                </div>
              </div>
              <div className="row form-space">
                <div className="col-lg-12">
                  <div className="content-space">
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <label className="loantenure">Loan Term</label>
                            <ul className="tenure-value"
                            >
                              <li>
                                <RadioButtonComponent
                                  id="radio1"
                                  label='Month'
                                  name='tenure'
                                  value="month"
                                  change={monthChanged}
                                  ref={monthChange}
                                />
                              </li>
                              <li>
                                <RadioButtonComponent
                                  id="radio2"
                                  checked={true}
                                  label='Year'
                                  name='tenure'
                                  value="year"
                                  change={yearChanged}
                                  ref={yearChange}
                                />
                              </li>
                            </ul>
                          </td>
                          <td>
                            <div className="editor-space">
                              <NumericTextBoxComponent
                                id="loan_txt"
                                format={loanNumFormat}
                                min={loanNumMinValue}
                                max={loanNumMaxValue}
                                value={loanValue}
                                step={loanNumStep}
                                width='150px'
                                change={loanNumChange}
                                ref={loanNumRef}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div id='loantenure'>
                    <SliderComponent
                      id='loantenure'
                      min={loanMinValue}
                      max={loanMaxValue}
                      step={loanStep}
                      value={loanValue}
                      type='MinRange'
                      ticks={loanTicks}
                      change={loanChanged}
                      ref={loanSliderRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row loan-content">
            <div className="col-lg-12 emi-content">
              <div>
                <h6 className="emi-header">Break-up of Total Payment</h6>
              </div>

              <div className="row">
                <div className="col-lg-7">
                  <AccumulationChartComponent
                    dataSource={[
                      {
                        'x': 'Principal Amount',
                        y: principalValue
                      },
                      {
                        'x': 'Interest Amount',
                        y: ((emi * tent) - principalValue)
                      }
                    ]}
                    background='transparent'
                    id="payment_pieChart"
                    enableSmartLabels={true}
                    height="365px"
                    width='100%'
                    enableAnimation={true}
                    legendSettings={{ visible: false }}
                    tooltip={{ enable: false }}
                    pointRender={pointRender}
                    ref={pie}
                  >
                    <Inject services={[PieSeries, Legend, Tooltip]} />
                    <AccumulationSeriesCollectionDirective>
                      <AccumulationSeriesDirective
                        xName='x'
                        yName='y'
                        type='Pie'
                        radius='80%'
                        startAngle={290}
                        endAngle={290}
                        innerRadius='60%'
                        explode={true}
                        explodeOffset='10%'
                        explodeIndex={3}
                      >
                      </AccumulationSeriesDirective>
                    </AccumulationSeriesCollectionDirective>
                  </AccumulationChartComponent>
                </div>
                <div className="col-lg-5 pie-content" id="pieContent">
                  <div>
                    <p><span className="pie-icon pie-principal"></span>Principal Amount</p>
                    <h5 id="loan_principal" ref={princAmount} >{principalAmt}</h5>
                  </div>
                  <div>
                    <p><span className="pie-icon pie-interest"></span>Total Interest</p>
                    <h5 id="loan_interest" ref={totalInt}>{interestAmt}</h5>
                  </div>
                  <div className="pie-total">
                    <span>
                      <p>Total Payment</p>
                      <p>(Principal + Interest)</p>
                    </span>
                    <h5 id="loan_total_payment" ref={totalPay}>{totalAmt}</h5>
                  </div>
                </div>
              </div>
              <div>
                <h6 className="emi-footer">Your Monthly Payment</h6>
                <h1 id="loan_emi" ref={monPayment}>{emiAmt}</h1>
              </div>
            </div>
            <svg height='0px'>
              <defs>
                <linearGradient id="principal_svg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0"></stop>
                  <stop offset="1"></stop>
                </linearGradient>
                <linearGradient id="interest_svg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0"></stop>
                  <stop offset="1"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="row top-space loan-content"
          style={{ textAlign: 'center' }}>
          <div className="graph-text">Monthly payments starting from</div>
          <div className="graph-input">
            < DatePickerComponent
              id="monthStarter"
              placeholder="Enter date"
              start="Year"
              showClearButton={false}
              showTodayButton={false}
              strictMode={true}
              depth="Year"
              format='MMM yyy'
              width='250px'
              value={dateValue}
              onChange={updateDateValue}
            />
          </div>
        </div>

        <div className="row top-space loan-content max-content">
          <h6 className="center-heading">Amortization Chart</h6>
          <div className="col-lg-12 graph-container">
            <ChartComponent
              style={{
                textAlign: 'center', display: 'block'
              }}
              id="paymentGraph"
              primaryXAxis={{
                title: 'Years',
                valueType: 'DateTime',
                labelFormat: 'y',
                intervalType: 'Years',
                majorGridLines: { width: 0 },
                minorGridLines: { width: 0 },
                majorTickLines: { width: 0 },
                minorTickLines: { width: 0 },
                lineStyle: { width: 1, dashArray: '2', color: 'rgba(255,255,255,0.2)' },
                labelStyle: labelStyle,
                titleStyle: titleStyle
              }}
              primaryYAxis={{
                title: 'Balance',
                interval: 50000,
                minimum: 0,
                labelFormat: 'c0',
                rangePadding: 'None',
                lineStyle: { width: 0 },
                majorTickLines: { width: 0 },
                majorGridLines: { width: 1, dashArray: '2', color: 'rgba(255,255,255,0.2)' },
                minorGridLines: { width: 0 },
                minorTickLines: { width: 0 },
                labelStyle: labelStyle,
                titleStyle: titleStyle
              }}
              axisLabelRender={axisLabelRender}
              tooltip={{
                enable: true,
                shared: true,
                format: '${series.name} : ${point.y}',
                header: '<b>${point.x}<b>',
                fill: '#FFFFFF',
                opacity: 1,
                textStyle: {
                  color: '#555555',
                  fontFamily: 'Roboto',
                  size: '12px',
                  fontWeight: '400',
                },
              }}
              chartArea={{ border: { width: 0 } }}
              enableSideBySidePlacement={false}
              height="500px"
              useGroupingSeparator={true}
              background="#27304c"
              palettes={['#FB6589', '#3AC8DC', '#FFFFFF']}
              titleStyle={{
                color: 'White',
                fontFamily: 'Raleway, sans-serif',
                fontWeight: '500',
                size: '20px',
              }}
              legendSettings={legendSettings}
              ref={accChart}
              dataSource={yearWiseData}
            >
              <Inject services={[LineSeries, StackingColumnSeries, DateTime, Legend, Tooltip]} />

              <AxesDirective>
                <AxisDirective majorGridLines={{ width: 0 }}
                  minorGridLines={{ width: 0 }}
                  minorTickLines={{ width: 0 }}
                  rowIndex={0} opposedPosition={true}
                  lineStyle={{ width: 0 }}
                  majorTickLines={{ width: 0 }}
                  name='yAxis1'
                  title='Payment'
                  labelRotation={0}
                  labelIntersectAction='Hide'
                  labelStyle={labelStyle}
                  titleStyle={titleStyle}
                  labelFormat='c0'
                >
                </AxisDirective>
              </AxesDirective>

              <SeriesCollectionDirective>
                <SeriesDirective
                  xName="yearN"
                  yName="yearPrincipal"
                  name="Principal Paid"
                  width={2}
                  colorName="rgb(255, 255, 255)"
                  marker={{ visible: true, width: 10, height: 10 }}
                  columnWidth={0.425}
                  type="StackingColumn"
                  yAxisName="yAxis1"
                  ref={acc1}
                ></SeriesDirective>
                <SeriesDirective
                  xName="yearN"
                  yName="yearInterest"
                  name="Interest Paid"
                  width={2}
                  columnWidth={0.425}
                  marker={{ visible: true, width: 10, height: 10 }}
                  type="StackingColumn"
                  yAxisName="yAxis1"
                ></SeriesDirective>
                <SeriesDirective
                  xName="yearN"
                  yName="endingBalance"
                  name="Balance"
                  width={2}
                  columnWidth={0.425}
                  marker={{ visible: true, width: 10, height: 10, fill: '#60448D' }}
                  type="Line"
                ></SeriesDirective>
              </SeriesCollectionDirective>
            </ChartComponent>
          </div>
        </div>

        <div className="row top-space loan-content max-content">
          <h6 className="center-heading">Amortization Schedule</h6>
          <div style={{ color: 'white' }}>
            <GridComponent
              dataSource={yearWiseData}
              childGrid={child}
              onClick={onclickEvent}
              ref={grid}
              enableHover={true}
              id='scheduleGrid'
              columns={columns}
              allowTextWrap={true}
            >
              <Inject services={[DetailRow, Page]} />
            </GridComponent>
          </div>
        </div>
      </div >
    </div>
  )
}
