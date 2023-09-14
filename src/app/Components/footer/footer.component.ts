import { Component, OnInit } from '@angular/core';
import { Fundacion } from 'src/app/Models/fundacion';
import { FundacionService } from 'src/app/Service/fundacion.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  constructor(

    private fundacionService: FundacionService,

  ) {

  }
  ngOnInit(): void {
    this.getDataFundation(1);
  }

  // MODEL
  public fundacion = new Fundacion();

  public getDataFundation(idFundacion: number) {
    this.fundacionService.getFundacionById(idFundacion).subscribe({
      next: (resp) => {
        this.fundacion = resp;
      }, error: (err) => {
        console.error('err');
      }
    });
  }

}
