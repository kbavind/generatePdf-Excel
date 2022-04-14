import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { ExcelConverter } from 'pdfmake-to-excel';
import { IPayload } from 'pdfmake-to-excel/dist/interfaces/IPayload.interface';
import { DH_CHECK_P_NOT_PRIME } from 'constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PdfExcelGen';
  holder: any;

  form: FormGroup | undefined;

  dataAPI() {
    return this.http
      .get(
        'https://www.7timer.info/bin/astro.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0'
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  passData() {
    this.dataAPI().subscribe((res) => {
      this.holder = res.dataseries;
      console.log(res);
    });
  }

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.passData();
  }

  buildTableBody(data: any[], columns: any[]) {
    var body = [];

    body.push(columns);

    data.forEach(function (row: { [x: string]: { toString: () => any; }; }) {
      var dataRow: any[] = [];

      columns.forEach(function (column: string | number) {
        dataRow.push(row[column].toString());
      });

      body.push(dataRow);
    });

    return body;
  }

  table(data: any, columns: string[]) {
    return {
      table: {
        headerRows: 2,
        body: this.buildTableBody(data, columns),
      },
    };
  }

  generatePdf() {
    console.log('IDENTIFER LOG');
    console.log(this.holder);

    let docDefinition = {
      content: [
        { text: 'PDF Generate', style: 'header' },
        this.table(this.holder, ['timepoint', 'cloudcover', 'wind10m']),
      ],
    };
    pdfMake.createPdf(docDefinition).open();
  }
// payload get from pdfmake
  generateExcel() {
    let contentDefinition = {
        "title": "Excel Generate",
        "data": [
          [{ text: 'Timepoint', style: 'tableheader' }, { text: 'cloudcover', style: 'tableheader' }, { text: 'wind10m', style: 'tableheader' }],
          [{"text": 3}, {"text": 1}, {"text":"[object Object]"}],
          [{"text": 6}, {"text": 1}, {"text":"[object Object]"}],
          [{"text": 9}, {"text": 1}, {"text":"[object Object]"}],
          [{"text": 12}, {"text": 1}, {"text":"[object Object]"}],
          [{"text": 15}, {"text": 1}, {"text":"[object Object]"}],
          [{"text": 18}, {"text": 1}, {"text":"[object Object]"}],
          [{"text": 21}, {"text": 3}, {"text":"[object Object]"}],
          [{"text": 24}, {"text": 3}, {"text":"[object Object]"}],
          [{"text": 27}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 30}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 33}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 36}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 39}, {"text": 7}, {"text":"[object Object]"}],
          [{"text": 42}, {"text": 8}, {"text":"[object Object]"}],
          [{"text": 45}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 48}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 51}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 54}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 57}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 60}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 63}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 66}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 69}, {"text": 9}, {"text":"[object Object]"}],
          [{"text": 72}, {"text": 9}, {"text":"[object Object]"}],
        ],
        styles: {
          tableheader: {
            color: 'gray',
            bold: true,
            fontSize: 10
          }
        }
    };
    const exporter = new ExcelConverter('TestExport', contentDefinition);

    // this.exConverter.downloadExcel();
    exporter.downloadExcel();
    console.log(this.generateExcel)
  }
}
