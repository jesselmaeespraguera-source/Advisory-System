import {
  Controller,
  Get,
  Post,
  Body,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
  ) {}

  @Get()
  getStudent() {
    return this.studentsService.getStudents();
  }

  @Get(':id')
  getStudentById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.studentsService.getStudentById(id);
  }

  @Post()
  createStudent(
    @Body() body: { name: string; programId: number },
  ) {
    return this.studentsService.createStudent(
      body.name,
      body.programId,
    );
  }
}