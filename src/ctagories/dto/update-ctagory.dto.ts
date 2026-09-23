import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseCategoryDto } from './create-ctagory.dto';

export class UpdateCourseCategoryDto extends PartialType(CreateCourseCategoryDto) {}
