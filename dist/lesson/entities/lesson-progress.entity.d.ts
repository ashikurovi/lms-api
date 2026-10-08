import { Lesson } from './lesson.entity';
import { Student } from '../../students/entities/student.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
export declare class LessonProgress {
    id: string;
    student_id: string;
    student: Student;
    lesson_id: string;
    lesson: Lesson;
    enrollment_id: string;
    enrollment: Enrollment;
    is_completed: boolean;
    created_at: Date;
    updated_at: Date;
}
