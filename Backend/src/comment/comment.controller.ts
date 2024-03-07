import { Controller, Post, Body } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './models/dto/create-comment.dto';
import { Comment } from './models/entities/comment.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('createComment') 
  createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.createComment(createCommentDto);
  }
}