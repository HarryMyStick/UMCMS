import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './models/dto/create-comment.dto';
import { Comment } from './models/entities/comment.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCommentDto } from './models/dto/update-comment.dto';
import { StudentReplyDto } from './models/dto/student-reply.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('createComment') 
  createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.createComment(createCommentDto);
  }

  @Post('getCommentsByContribution/:contributionId')
  async getAllCommentsForContribution(@Param('contributionId') contributionId: string): Promise<Comment[]> {
    const data = this.commentService.getAllCommentsForContribution(contributionId);
    if (!data || (await data).length === 0) {
      return [];
    }

    return data;
  }

  @Post('updateComment')
  async updateComment(@Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentService.updateComment(updateCommentDto);
  }

  @Delete('deleteComment/:commentId')
  async deleteComment(@Param('commentId') commentId: string): Promise<void> {
    return this.commentService.deleteComment(commentId);
  }

  @Post('studentReply')
  async studentReply(@Body() StudentReplyDto: StudentReplyDto): Promise<Comment> {
    return this.commentService.studentReply(StudentReplyDto);
  }

}