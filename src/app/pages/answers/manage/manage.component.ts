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
  userId: number = 0; // Asignar un valor por defecto
  questionId: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
  questions: any[] = []; // Lista de preguntas, si es necesario
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

    // cargar los usuarios
    this.UsersService.list().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      },
    });

    // cargar las preguntas
    this.SecurityQuestionsService.list().subscribe({
      next: (data) => {
        this.questions = data;
      },
      error: () => {
        Swal.fire("Error", "No se pudieron cargar las preguntas", "error");
      },
    });

    if (this.activatedRoute.snapshot.params.id) {
      this.Answer.id = this.activatedRoute.snapshot.params.id;
      this.getAnswer(this.Answer.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0, []],
      content: ["", [Validators.required, Validators.minLength(2)]],
      userId: [null, [Validators.required]],
      questionId: [null, [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getAnswer(id: number) {
    this.AnswersService.view(id).subscribe({
      next: (response) => {
        this.Answer = response;

        this.theFormGroup.patchValue({
          id: this.Answer.id,
          content: this.Answer.content,
          userId: this.Answer.userId,
          questionId: this.Answer.questionId,
        });

        console.log("Answer fetched successfully:", this.Answer);
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
    this.AnswersService.create(this.theFormGroup.value.userId,
  this.theFormGroup.value.questionId,
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
