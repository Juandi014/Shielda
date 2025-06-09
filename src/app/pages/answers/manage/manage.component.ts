import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Answer } from "src/app/models/answer.model";
import { UserService } from "src/app/services/user.service";
import { SecurityQuestionService } from "src/app/services/security-question.service";
import { AnswerService } from "src/app/services/answer.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  Answer: Answer;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  user_id: number = 0; // Asignar un valor por defecto
  security_question_id: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
  questions: any[] = []; // Lista de preguntas, si es necesario
  userNameToShow: string = '';
  userQuestionToShow: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private AnswersService: AnswerService,
    private UsersService: UserService,
    private SecurityQuestionsService: SecurityQuestionService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.Answer = { id: 0 };
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join("/");
    if (currentUrl.includes("view")) {
      this.mode = 1;
    } else if (currentUrl.includes("create")) {
      this.mode = 2;
    } else if (currentUrl.includes("update")) {
      this.mode = 3;
    }

    if (this.mode === 1) {
      this.theFormGroup.get('content')?.disable();
    }

    // cargar los usuarios y preguntas primero
  Promise.all([
    this.UsersService.list().toPromise(),
    this.SecurityQuestionsService.list().toPromise()
  ])
  .then(([usersData, questionsData]) => {
    this.users = usersData;
    this.questions = questionsData;

    // Solo ahora cargamos la respuesta
    if (this.activatedRoute.snapshot.params.id) {
      this.Answer.id = this.activatedRoute.snapshot.params.id;
      this.getAnswer(this.Answer.id);
    }
  })
  .catch(() => {
    Swal.fire("Error", "No se pudieron cargar los datos", "error");
  });
  }

  getUserNameById(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? user.name : '';
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0, []],
      content: ["", [Validators.required, Validators.minLength(2)]],
      user_id: [null, [Validators.required]],
      security_question_id: [null, [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getAnswer(id: number) {
    this.AnswersService.view(id).subscribe({
      next: (response) => {
        this.Answer = response;

        console.log("Fetched Answer:", this.Answer);

        this.theFormGroup.patchValue({
          id: this.Answer.id,
          content: this.Answer.content,
          user_id: this.Answer.user_id,
          security_question_id: this.Answer.security_question_id,
        });

        // Buscar y guardar el nombre del usuario para mostrarlo en modo "view"
      const foundUser = this.users.find(u => u.id === this.Answer.user_id);
      this.userNameToShow = foundUser ? foundUser.name : '';

      // Buscar y guardar el nombre del usuario para mostrarlo en modo "view"
      const foundQuestion = this.questions.find(u => u.id === this.Answer.security_question_id);
      this.userQuestionToShow = foundQuestion ? foundQuestion.name : '';
        
      },
      error: (error) => {
        console.error("Error fetching Answer:", error);
      },
    });
  }
  back() {
    this.router.navigate(["/answers/list"]);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: "Error!",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error",
      });
      return;
    }
    this.AnswersService.create(this.theFormGroup.value.user_id,
  this.theFormGroup.value.security_question_id,
  { content: this.theFormGroup.value.content }).subscribe({
      next: (Answer) => {
        console.log("Answer created successfully:", Answer);
        Swal.fire({
          title: "Creado!",
          text: "Registro creado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/answers/list"]);
      },
      error: (error) => {
        console.error("Error creating Answer:", error);
      },
    });
  }
  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: "Error!",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error",
      });
      return;
    }
    this.AnswersService.update(this.theFormGroup.value).subscribe({
      next: (Answer) => {
        console.log("Answer updated successfully:", Answer);
        Swal.fire({
          title: "Actualizado!",
          text: "Registro actualizado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/answers/list"]);
      },
      error: (error) => {
        console.error("Error updating Answer:", error);
      },
    });
  }
}
