import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomErrorStateMatcher } from 'src/app/helpers/customErrorStateMatcher';
import { CountriesService } from '../../services/countries.service';
import { CitiesService } from '../../services/cities.service';
import { City } from '../../models/City';
import { debounceTime, tap, switchMap } from "rxjs/operators";

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
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  cities: City[] = [];

   //checkbox-group
  hobbies: any[] = [
    { id: 1, hobbyName: "Musica" },
    { id: 2, hobbyName: "Food" },
    { id: 3, hobbyName: "Viagens" },
    { id: 4, hobbyName: "Pets" },
    { id: 5, hobbyName: "Caminhada" },
  ];
 
    //date-picker
  minDate: Date = new Date("1950-01-01");
  maxDate: Date = new Date("2010-12-31");
  dateHint: string = "Escolha data de nascimento";
  startDate: Date = new Date("2002-01-01");

  dateFilter(date)
  {
    return date && date.getDay() !== 0 && date.getDay() !== 6;
  }

  onDateChange()
  {
    if (this.formGroup.value.dateOfBirth)
    {
      let date = new Date(this.formGroup.value.dateOfBirth);
      this.dateHint = `Você nasceu numa ${date.toString().substr(0, date.toString().indexOf(" "))}`;
    }
    else
    {
      this.dateHint = "Escolha data de Nascimento";
    }
  }
  constructor(
    private countriesService: CountriesService,
    private citiesService: CitiesService)
  {
    this.formGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      customerName: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern('^[A-Za-z. ]*$')]),
      country: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      receiveNewsLetters: new FormControl(null),
      hobbies: new FormArray([]),
      allHobbies: new FormControl(false),
      gender: new FormControl(null, [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required])
    });
    
    //add form controls to form array
    this.hobbies.forEach(() =>
    {
      this.hobbiesFormArray.push(new FormControl(false));
    });
  }
  
   //returns the form array
  get hobbiesFormArray(): FormArray
  {
    return this.formGroup.get("hobbies") as FormArray;
  }

  //executes when the user clicks on "All" checkbox for hobbies
  onAllHobbiesCheckBoxChange()
  {
    this.hobbiesFormArray.controls.forEach((hobby, index) =>
    {
      this.hobbiesFormArray.at(index).patchValue(this.formGroup.value.allHobbies);
    });
  }

  //returns true, if all hobby checkboxes are checked
  allHobbiesSelected()
  {
    return this.hobbiesFormArray.value.every(val => val === true); //[true, true, true, true, true]
  }

  //returns true, if all hobby checkboxes are unchecked
  noHobbiesSelected()
  {
    return this.hobbiesFormArray.value.every(val => val === false); //[false, false, false, false, false]
  }

  //executes when the user checks / unchecks any hobby checkbox
  onHobbyChange(i)
  {
    if (this.allHobbiesSelected())
      this.formGroup.patchValue({ allHobbies: true });
    else
      this.formGroup.patchValue({ allHobbies: false });
  }


  ngOnInit(): void
  {
    //País
    this.countriesService.getCountries().subscribe(
      (response) =>
      {
        this.countries = response;
      },
      (error) =>
      {
        console.log(error);
      });

      //Cidades
    this.citiesService.getCities().subscribe(
      (response) =>
      {
        this.cities = response;
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
            return "<strong>Nome</strong> é obrigatório";
          else if (errorType === "maxlength")
            return "<strong>Nome</strong> deve ter no maximo 50 caracteres";
            else if (errorType === "minlength")
            return "<strong>Nome</strong> deve ter no mínimo 4 caracteres";
          else if (errorType === "pattern")
            return "<strong>Nome</strong> pode apenas alfabéticos, espaços ou ponto";
          else
            return "";
        }

      case "email":
        {
          if (errorType === "required")
            return "<strong>Email</strong> é obrigatório";
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

        case "city":
        {
          if (errorType === "required")
            return "<strong>Cidade</strong> é obrigatória";
          else
            return "";
        }

        case "gender":
        {
          if (errorType === "required")
            return "Escolha o gênero entre Masculino ou Feminino ou Outros";
          else
            return "";
        }

        case "dateOfBirth":
        {
          if (errorType === "required")
            return "<strong>data de nascimento</strong> é obrigatória";
          else
            return "";
        }

      default: return "";
    }
  }

}
