import { Component, Input, OnInit } from '@angular/core';
export class CommentNode {
  text:string ='';
  user:string ='';
  answers:CommentNode[] = [];
  isOpen:false;
  constructor(text:string, user:string){
    this.text = text;
    this.user = user;
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
  @Input()
  comments:CommentNode[] = [];
  text:string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.comments);
  }

  addComment(comment:CommentNode){
    comment.addAnswer(new CommentNode(this.text, "Kasiga Balinda"));
    comment.isOpen = false;
    this.text="";
    console.log(this.comments);
  }

  openCommentText(comment){
    console.log(comment)
    comment.isOpen = !comment.isOpen;
  }

  remove(comment:CommentNode){
    let index = this.comments.indexOf(comment);
    this.comments = this.comments.splice(index,1);
  }

}
