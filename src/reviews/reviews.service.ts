import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const review = this.reviewRepository.create(createReviewDto);
    return await this.reviewRepository.save(review);
  }

  async findAll() {
    return await this.reviewRepository.find({ relations: { student: true, batch: true } });
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: { student: true, batch: true } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: string) {
    const review = await this.findOne(id);
    return await this.reviewRepository.remove(review);
  }
}
