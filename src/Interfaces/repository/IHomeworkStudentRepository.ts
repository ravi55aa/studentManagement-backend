import { FilterQuery } from 'mongoose';
import { IHomeworkSubmission } from '@Models/Student/homeworkSubmitModel';

export interface IStudentHomeworkRepository {
  submitHomework(data: Partial<IHomeworkSubmission>): Promise<IHomeworkSubmission | null>;

  findSubmissionById(id: string): Promise<IHomeworkSubmission | null>;

  getStudentSubmissions(
    query: FilterQuery<Partial<IHomeworkSubmission>>,
  ): Promise<IHomeworkSubmission[]>;

  updateSubmission(
    id: string,
    data: Partial<IHomeworkSubmission>,
  ): Promise<IHomeworkSubmission | null>;

  deleteSubmission(id: string): Promise<boolean>;
}
