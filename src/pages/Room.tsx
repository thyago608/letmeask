import { useRef, FormEvent, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { useRoom } from "hooks/useRoom";
import { Button } from "components/Button";
import { RoomCode } from "components/RoomCode";
import { Question } from "components/Question";
import { database } from "services/firebase";
import * as firebaseDatabase from "firebase/database";

import logoImg from "assets/images/logo.svg";

import "styles/room.scss";

type RoomParams = {
  id: string;
};

export function Room() {
  const { id } = useParams<RoomParams>();
  const { user } = useAuth();
  const { title, questions } = useRoom(id as string);
  const questionRef = useRef<HTMLTextAreaElement>(null);

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
          <h1>Sala {title}</h1>
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
        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              author={question.author}
              content={question.content}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
