import { useEffect, useState } from "react";
import * as firebaseDatabase from "firebase/database";
import { database } from "services/firebase";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export function useRoom(id: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getFirebaseQuestions = async () => {
      //Referênciando a sala atual no banco de dados
      const roomRef = firebaseDatabase.ref(database, `rooms/${id}`);

      //Buscando as informações da sala atual no banco
      const roomData = await firebaseDatabase.get(roomRef);

      const databaseroom = roomData.val();

      const firebaseQuestions: FirebaseQuestions = databaseroom.questions ?? {};

      let questionsFormatted = [];

      for (const [key, value] of Object.entries(firebaseQuestions)) {
        questionsFormatted.push({
          id: key,
          ...value,
        });
      }

      setQuestions([...questionsFormatted]);
      setTitle(databaseroom.title);
    };

    getFirebaseQuestions();
  }, [id]);

  useEffect(() => {
    const roomRef = firebaseDatabase.ref(database, `rooms/${id}`);

    const newQuestions = firebaseDatabase.onChildChanged(
      roomRef,
      (questions) => {
        const questionsRoom: FirebaseQuestions = questions.val();

        let questionsFormatted = [];

        for (const [key, value] of Object.entries(questionsRoom)) {
          questionsFormatted.push({
            id: key,
            ...value,
          });
        }

        setQuestions([...questionsFormatted]);
      }
    );

    return () => newQuestions();
  }, []);

  return { title, questions };
}
