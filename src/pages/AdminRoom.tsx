import { useParams, Link, useNavigate } from "react-router-dom";
import { useRoom } from "hooks/useRoom";
import { Button } from "components/Button";
import { RoomCode } from "components/RoomCode";
import { Question } from "components/Question";
import { database } from "services/firebase";
import * as firebaseDatabase from "firebase/database";

import deleteImg from "assets/images/delete.svg";
import logoImg from "assets/images/logo.svg";

import "styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { id } = useParams<RoomParams>();
  const { title, questions } = useRoom(id as string);
  const navigate = useNavigate();

  async function handleEndRoom() {
    const roomRef = firebaseDatabase.ref(database, `rooms/${id}`);

    await firebaseDatabase.update(roomRef, {
      endedAt: new Date(),
    });

    navigate("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    //O Window.confirm retornará um valor booleano de acordo com a escolha do usuário
    if (window.confirm("Você deseja excluir essa pergunta?")) {
      const questionRef = firebaseDatabase.ref(
        database,
        `rooms/${id}/questions/${questionId}`
      );

      await firebaseDatabase.remove(questionRef);
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask" />
          </Link>

          <div>
            <RoomCode code={id as string} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              author={question.author}
              content={question.content}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover Pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
