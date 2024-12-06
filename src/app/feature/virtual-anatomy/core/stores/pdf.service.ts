import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../interfaces/search-group.interface";
import {jsPDF} from 'jspdf';
import { PdfRow } from "../interfaces/pdf.interface";

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private readonly _data = new BehaviorSubject<User[]>([]);
  private readonly _c1 = new BehaviorSubject<string[]>([]);
  private readonly _c2 = new BehaviorSubject<string[]>([]);
  private readonly _comp = new BehaviorSubject<string[]>([]);
  private readonly _groupName = new BehaviorSubject<string>('');
  private currentDate = new Date().toLocaleDateString();

  get accessData() {
    return this._data.value;
  }
  set accessData(data: User[]) {
    this._data.next(data);
  }
  get accessGroupName() {
    return this._groupName.value;
  }
  set accessGroupName(data: string) {
    this._groupName.next(data);
  }
  get accessC1() {
    return this._c1.value;
  }
  set accessC1(c1: string[]) {
    this._c1.next(c1);
  }
  get accessC2() {
    return this._c2.value;
  }
  set accessC2(c2: string[]) {
    this._c2.next(c2);
  }
  get accessComp() {
    return this._comp.value;
  }
  set accessComp(comp: string[]) {
    this._comp.next(comp);
  }

  public generatePDF():void {

    const pdf = new jsPDF('l','mm','letter');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const logoWidth = 20;
    const itemsPerPage = 20;
    let currentY = 40;

    const grupo = this.accessGroupName;
    const fecha = this.currentDate;

    //Agregar logo en la parte superior derecha
    const addLogo = () => {
      const logoUrl=  './assets/images/logo.png';
      const marginRight = 10;
      const xPos = pageWidth - logoWidth -marginRight;
      pdf.addImage(logoUrl, 'JPG', xPos, 10, logoWidth,25);
    }

    //Agregar Cabezera
    const addTableHeader = ()=>{
      pdf.setFont('Helvetica','bold');
      pdf.setFontSize(20);
      pdf.text('I.E. 5076 Nuestra Señora de las Mercedes', 75, 20);
      pdf.setFontSize(16);
      pdf.text('Reporte de Resultados', 10, 33);

      //Agregar grupo y fecha debajo del titulo
      pdf.setFontSize(10);
      pdf.setFont('Helvetica','normal');
      pdf.text(`Grupo: ${grupo}`, 10, 40);
      pdf.text(`Fecha: ${fecha}`, 10, 45);

      pdf.setDrawColor(0);
      pdf.setFillColor(200,200,200);

      currentY = 55;

      //tabla
      pdf.rect(10, currentY, 8, 20, 'FD');
      pdf.rect(18, currentY, 42, 20, 'FD'); //nombre
      pdf.rect(60, currentY, 45, 20, 'FD'); //apellido
      pdf.rect(105, currentY, 15, 20, 'FD'); //grado
      pdf.rect(120, currentY, 17, 20, 'FD'); //seccion
      pdf.rect(137, currentY, 23, 20, 'FD'); //fecha
      pdf.rect(160, currentY, 36, 20, 'FD'); //capa1
      pdf.rect(196, currentY, 36, 20, 'FD'); //capa2
      pdf.rect(232, currentY, pageWidth - 242, 20, 'FD'); //competencia

      pdf.setTextColor(0);
      pdf.text('#',13, currentY + 12);
      pdf.text('Nombre',32, currentY + 12);
      pdf.text('Apellido',77, currentY + 12);
      pdf.text('Grado',108, currentY + 12);
      pdf.text('Sección',122, currentY + 12);
      pdf.text('Fecha',143, currentY + 12);
      pdf.setFontSize(8);
      pdf.text(
        '   Comprende y explica\n'+
        'conocimientos científicos\n'+
        '         (capacidad 1)',
        163, currentY + 8);
      pdf.text(
        '    Evalúa las implicancias\n'+
        '  científicas y tecnológicas\n'+
        '           (capacidad 2)',
        196, currentY + 8);
      pdf.text(
        '   Explica el mundo físico\n'+
        'basado en conocimientos\n'+
        '         (competencia)',
        235, currentY + 8);


      currentY += 20;

    };


    // Agregar filas con bordes

    const addTableRow = (index:number, user:User, c1:string, c2:string, comp:string) => {
      const dateUser: string = new Date(user.createAt).toLocaleDateString();

      pdf.setFont('Helvetica','normal');
      pdf.setFontSize(10);

      //Dibujar las Celdas
      pdf.rect(10, currentY, 8, 10);
      pdf.rect(18, currentY, 42, 10); //nombre
      pdf.rect(60, currentY, 45, 10); //apellido
      pdf.rect(105, currentY, 15, 10); //grado
      pdf.rect(120, currentY, 17, 10); //seccion
      pdf.rect(137, currentY, 23, 10); //fecha
      pdf.rect(160, currentY, 36, 10); //capa1
      pdf.rect(196, currentY, 36, 10); //capa2
      pdf.rect(232, currentY, pageWidth - 242, 10); //competencia

      // texto en las celdas
      pdf.setTextColor(0);
      pdf.setFontSize(8);
      pdf.text(`${index + 1} `,13,currentY + 7);
      pdf.text(user.name,20,currentY + 7);
      pdf.text(user.lastName,62,currentY + 7);
      pdf.text(user.grade.toString(),112,currentY + 7);
      pdf.text(user.section,127,currentY + 7);
      pdf.text(dateUser,143,currentY + 7);
      pdf.text(c1,177,currentY + 7);
      pdf.text(c2,213,currentY + 7);
      pdf.text(comp,249,currentY + 7);

      currentY += 10;

    };

    // Agregar numero de pagina en el pie de pagina

    const addPageNumbers = ()=>{
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {

        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Pagina ${i} de ${pageCount}`, pageWidth - 50, pageHeight - 10);
      }

    };

    // Generar el reporte paginado

    const generateReport = ()=>{

      addLogo();
      addTableHeader();

      let pdfBody: PdfRow[] = [];
      for(let i=0; i<this.accessData.length; i++) {
        pdfBody.push({
          user: this.accessData[i],
          c1: this.accessC1[i],
          c2: this.accessC2[i],
          comp: this.accessComp[i]
        })
      }

      pdfBody.forEach((data,index)=>{

        if (index > 0 && index % itemsPerPage === 0) {

          pdf.addPage();
          currentY = 40;
          addLogo();
          addTableHeader();

        }

        addTableRow(index,data.user,data.c1,data.c2,data.comp)

      });

      //Aggregar numeracion de paginas al final
      addPageNumbers();

      //Guardar PDF
      pdf.save('reporte_ejemplo.pdf');

    };

    //Cargar el logo y generar el reporte
    const logoImage = new Image();
    logoImage.src = './assets/images/logo.png';
    logoImage.onload = ()=>{

      generateReport();

    };
  }

}
