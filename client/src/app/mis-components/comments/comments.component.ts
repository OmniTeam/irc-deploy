import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { v4 as uuid } from 'uuid';

export class CommentNode {
  id:string = '';
  text:string ='';
  user:string ='';
  likes: Array<string> = [];
  dateTimeCreated: Date;
  answers:CommentNode[] = [];
  isOpen:false;
  constructor(id: string, text:string, user:string, likes: Array<string>, answers: CommentNode[], dateTimeCreated:Date){
    this.id = id;
    this.text = text;
    this.user = user;
    this.likes = likes;
    this.answers = answers;
    this.dateTimeCreated = dateTimeCreated;
  }

  addAnswer(newComment:CommentNode){
    if(newComment.text){
      this.answers.push(newComment);
    }
  }

  removeComment(newComment:CommentNode){
    let index = this.answers.indexOf(newComment);
    if(~index){
      this.answers.slice(index,1);
    }
  }
}
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() comments:CommentNode[] = [];
  @Input() isRecommendation: boolean = false;

  @Output() commentsChanged: EventEmitter<CommentNode[]> = new EventEmitter();

  text:string;
  numberOfLikes:number;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    //console.log("Component Comments", this.comments);
  }

  addComment(comment:CommentNode){
    comment.addAnswer(new CommentNode(uuid(), this.text, this.authService.getLoggedInUsername(),[], [], new Date()));
    comment.isOpen = false;
    this.text="";
    this.commentsChanged.emit(this.comments);
  }

  openCommentText(comment){
    console.log(comment)
    comment.isOpen = !comment.isOpen;
  }

  deleteComment(comment:CommentNode){
    let index = this.comments.indexOf(comment);
    this.comments = this.comments.splice(index,1);
    this.commentsChanged.emit(this.comments);
  }

  isLiked(comment:CommentNode) : boolean {
    return comment.likes.includes(this.authService.getLoggedInUsername());
  }

  addLike(comment:CommentNode) {
    let oldComment = comment;
    comment.likes.push(this.authService.getLoggedInUsername());
    this.updateComment(oldComment, comment);
  }

  removeLike(comment:CommentNode) {
    let oldComment = comment;
    const index = comment.likes.indexOf(this.authService.getLoggedInUsername(), 0);
    if (index > -1) {
      comment.likes.splice(index, 1);
    }
    this.updateComment(oldComment, comment);
  }

  updateComment(oldComment:CommentNode, newComment:CommentNode) {
    const index: number = this.comments.indexOf(oldComment);
    if (index !== -1) {
      this.comments[index] = newComment;
    }
    this.commentsChanged.emit(this.comments);
  }
}
