import { Component } from '@angular/core';
import { PayloadAnimales } from 'src/app/Payloads/animalesPayload';
import { AnimalService } from 'src/app/Service/animal.service';
import { FOLDER_IMAGES, getFile } from 'src/app/util/const-data';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent {

  public ListAnimales: PayloadAnimales[] = [];

  constructor(
    private animalesService: AnimalService,
  ) { }

  ngOnInit(): void {
    this.getAllMascotas();
  }

  // Parameters
  isPage: number = 0;
  isSize: number = 3
  isSort: string[] = ['nombreAnimal', 'asc']
  pageTotal: number = 0;
  isFirst: boolean = false;
  isLast: boolean = false;

  getAllMascotas() {
    this.animalesService.getAll(this.isPage, this.isSize, this.isSort).subscribe((data: any) => {
      this.ListAnimales = data.content;
      console.log(data.content)
      this.pageTotal = data.totalPages
    })
  }

  anteriorPage(): void {
    if (!this.isFirst) {
      this.isPage--;
      this.getAllMascotas();
    }
  }

  siguientePage(): void {
    if (!this.isLast) {
      this.isPage++;
      this.getAllMascotas();
    }
  }

  public getUriFile(fileName: string): string {
    return getFile(fileName, FOLDER_IMAGES);
  }

  // MODAL
  visible: boolean = false;
  showModalAnimales() {
    this.visible = true;
    this.getAllMascotas();
  }

  isTextDigit: string = '';

  onInputChange() {
    if (this.isTextDigit === '') {
      this.getAllMascotas();
    }
  }
}
