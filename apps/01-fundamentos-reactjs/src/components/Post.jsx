import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Avatar } from './Avatar';
import { Comment } from './Comment';
import styles from './Post.module.css';

export function Post({ author, content, publishedAt }) {
  const [comments, setComments] = useState(['Post muito bacana, hein?!']);
  const [newCommentText, setNewCommentText] = useState('');

  const publishedDateFormatted = format(
    publishedAt,
    "d 'de' LLLL 'às' H:mm'h'",
    { locale: ptBR }
  );

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  const handleCreateNewComment = () => {
    event.preventDefault();

    setComments([...comments, newCommentText]);
    setNewCommentText('');
  }

  const handleNewCommentChange = () => {
    event.target.setCustomValidity('');    
    setNewCommentText(event.target.value);
  };
  const handleNewCommentInvalid = () => {
    event.target.setCustomValidity('Esse campo é obrigatório!');
  };

  const deleteComment = (commentToDelete) => {
    const commentsWithoutDeleteOne = comments.filter(comment => comment !== commentToDelete);
    setComments(commentsWithoutDeleteOne);
  }

  const isNewCommentEmpty = !newCommentText;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>
        <time
          title={publishedDateFormatted}
          dateTime={publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>
      <div className={styles.content}>
        {content.map(({ type, content }) => {
          if (type === 'paragraph') {
            return <p key={content}>{content}</p>;
          } else if (type === 'link') {
            return (
              <p key={content}>
                <a href="#">{content}</a>
              </p>
            );
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>
        <textarea
          name="comment"
          placeholder="Deixe seu comentário"
          value={newCommentText}
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required
        />
        <footer>
          <button
            type="submit"
            disabled={isNewCommentEmpty}
          >Publicar</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map(comment => {
          return <Comment
            key={comment}
            content={comment}
            onDeleteComment={deleteComment}
          />;
        })}
      </div>
    </article>
  );
}
