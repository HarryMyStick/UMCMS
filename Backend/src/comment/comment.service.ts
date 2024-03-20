import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './models/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './models/dto/create-comment.dto';
import { Contribution } from 'src/contribution/models/entities/contribution.entity';
import { UpdateCommentDto } from './models/dto/update-comment.dto';
import { StudentReplyDto } from './models/dto/student-reply.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Contribution) private contributionRepository: Repository<Contribution>,
  ) { }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const contribution = await this.contributionRepository.findOne({
      where: [{ contribution_id: createCommentDto.contribution_id }],
    });

    if (!contribution) {
      throw new NotFoundException(`Contribution with ID ${createCommentDto.contribution_id} does not exist`);
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      contribution_id: contribution
    });

    await this.commentRepository.save(comment);

    return comment;
  }

  async getAllCommentsForContribution(contributionId: string): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.contribution_id', 'contribution')
      .where('contribution.contribution_id = :contributionId', { contributionId })
      .getMany();
  }

  async updateComment(updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: [{comment_id: updateCommentDto.comment_id}],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${updateCommentDto.comment_id} not found`);
    }

    comment.comment_content = updateCommentDto.comment_content;
    comment.submission_date = updateCommentDto.submission_date;

    return this.commentRepository.save(comment);
  }

  async deleteComment(commentId: string): Promise<void> {
    const result = await this.commentRepository.delete(commentId);

    if (result.affected === 0) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
  }

  async studentReply(studentReplyDto: StudentReplyDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: [{comment_id: studentReplyDto.comment_id}],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${studentReplyDto.comment_id} not found`);
    }

    comment.student_reply = studentReplyDto.student_reply;
    comment.student_submission_date = studentReplyDto.student_submission_date;

    return this.commentRepository.save(comment);
  }
}
