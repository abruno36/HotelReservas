import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit
{
  //property
  countries: any;
  formGroup: FormGroup;

  constructor(private countriesService: CountriesService)
  {
    this.formGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      customerName: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern('^[A-Za-z. ]*$')]),
      country: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void
  {
    this.countriesService.getCountries().subscribe(
      (response) =>
      {
        this.countries = response;
      },
      (error) =>
      {
        console.log(error);
      });
  }

  //returns the form control instance based on the control name
  getFormControl(controlName: string): FormControl
  {
    return this.formGroup.get(controlName) as FormControl;
  }

  //returns the error message based on the given control and error
  getErrorMessage(controlName: string, errorType: string): string
  {
    //controlName = "customerName"
    //errorType = "required"
    switch (controlName)
    {
      case "customerName":
        {
          if (errorType === "required")
            return "<strong>Name</strong> é obrigatório";
          else if (errorType === "maxlength")
            return "<strong>Name</strong> deve ter no maximo 50 caracteres";
            else if (errorType === "minlength")
            return "<strong>Name</strong> deve ter no mínimo 4 caracteres";
          else if (errorType === "pattern")
            return "<strong>Name</strong> pode apenas alfabéticos, espaços ou ponto";
          else
            return "";
        }

      case "email":
        {
          if (errorType === "required")
            return "<strong>Email</strong> obrigatório";
          else if (errorType === "email")
            return "<strong>Email</strong> formato incorreto. Ex: someone@example.com.br";
          else
            return "";
        }

      case "country":
        {
          if (errorType === "required")
            return "<strong>País</strong> é obrigatório";
          else
            return "";
        }

      default: return "";
    }
  }

}
