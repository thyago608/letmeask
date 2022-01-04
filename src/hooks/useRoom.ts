import { useEffect, useState } from "react";
import { useAuth } from "hooks/useAuth";
import * as firebaseDatabase from "firebase/database";
import { database, firebase } from "services/firebase";

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
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
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
  likesCount: number;
  likeId: string | undefined;
};

export function useRoom(id: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");
  const { user } = useAuth();

  //Busca as questions no Banco do Firebase
  useEffect(() => {
    const getFirebaseQuestions = async () => {
      //Referênciando a sala atual no banco de dados
      const roomRef = firebaseDatabase.ref(database, `rooms/${id}`);

      //Buscando as informações da referência fornecida.
      const roomData = await firebaseDatabase.get(roomRef);

      //"Convertendo" os dados obtidos da referência.
      const databaseroom = roomData.val();

      //Questões da sala atual
      const firebaseQuestions: FirebaseQuestions = databaseroom.questions ?? {};

      const questionsFormatted = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likesCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );

      setQuestions([...questionsFormatted]);
      setTitle(databaseroom.title);
    };

    getFirebaseQuestions();
  }, [id, user?.id]);

  //Monitoramento das atualizações no Banco do Firebase
  useEffect(() => {
    const roomRef = firebaseDatabase.ref(database, `rooms/${id}/questions`);

    const unSubscribeNewQuestions = firebaseDatabase.onValue(
      roomRef,
      (questions) => {
        const questionsRoom: FirebaseQuestions = questions.val();

        const questionsFormatted = Object.entries(questionsRoom ?? {}).map(
          ([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
              likesCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(
                ([key, like]) => like.authorId === user?.id
              )?.[0],
            };
          }
        );

        setQuestions([...questionsFormatted]);
      }
    );
    return () => unSubscribeNewQuestions();
  }, [id, user?.id]);

  return { title, questions };
}

/*


    


*/
