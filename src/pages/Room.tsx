import { useRef, FormEvent, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { useRoom } from "hooks/useRoom";
import { Button } from "components/Button";
import { RoomCode } from "components/RoomCode";
import { Question } from "components/Question";
import { Loading } from "components/Loading";
import { database } from "services/firebase";
import * as firebaseDatabase from "firebase/database";

import logoImg from "assets/images/logo.svg";

import "styles/room.scss";
import { NotFound } from "components/NotFound";

type RoomParams = {
  id: string;
};

export function Room() {
  const { id } = useParams<RoomParams>();
  const { user } = useAuth();
  const { title, questions } = useRoom(id as string);
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(true);

  //Fucionalidade de enviar questão
  async function handleSendQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //Se o usuário não estiver autenticado
    if (!user) {
      throw new Error("You must be logged in");
    }

    //Se após retirar os espaços laterais o valor que está no textarea estiver vazio.
    if (questionRef.current?.value.trim() === "") {
      return;
    }

    const question = {
      content: questionRef.current?.value,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isAnswered: false,
      isHighlighted: false,
    };

    //Referênciando um local dentro do banco de dados
    const questionsRef = firebaseDatabase.ref(
      database,
      `rooms/${id}/questions`
    );

    await firebaseDatabase.push(questionsRef, question);

    questionRef.current!.value = "";
  }

  //Funcionalidade de dar like
  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (likeId) {
      const likeRef = firebaseDatabase.ref(
        database,
        `rooms/${id}/questions/${questionId}/likes/${likeId}`
      );

      await firebaseDatabase.remove(likeRef);
    } else {
      const likesRef = firebaseDatabase.ref(
        database,
        `rooms/${id}/questions/${questionId}/likes`
      );

      await firebaseDatabase.push(likesRef, {
        authorId: user?.id,
      });
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="container-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <RoomCode code={id as string} />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder=" O que você quer perguntar ?"
            ref={questionRef}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        {questions.length > 0 ? (
          <div className="question-list">
            {questions.map((question) => (
              <Question
                key={question.id}
                author={question.author}
                content={question.content}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <button
                    className={`like-button ${question.likeId ? "liked" : ""}`}
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() =>
                      handleLikeQuestion(question.id, question.likeId)
                    }
                  >
                    {question.likesCount > 0 && (
                      <span>{question.likesCount}</span>
                    )}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </Question>
            ))}
          </div>
        ) : (
          <div className="container-empty">
            <NotFound />
            <span>Até o momento não existem perguntas nesta sala</span>
          </div>
        )}
      </main>
    </div>
  );
}
