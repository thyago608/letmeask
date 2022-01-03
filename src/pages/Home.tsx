import { useRef, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as firebaseDatabase from "firebase/database";
import { useAuth } from "hooks/useAuth";
import { Button } from "components/Button";
import { database } from "services/firebase";

import illustrationImg from "assets/images/illustration.svg";
import logoImg from "assets/images/logo.svg";
import googleIconImg from "assets/images/google-icon.svg";

import "styles/auth.scss";

export function Home() {
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();
  const inputRoomCode = useRef<HTMLInputElement>(null);

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    navigate("rooms/new");
  }

  async function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //Se após retirar os espaços laterais o valor que estiver no campo se encontrar vazio.
    if (inputRoomCode.current?.value.trim() === "") {
      return;
    }

    //Pegando a referência de uma sala de acordo com o valor que está no input.
    const roomRef = firebaseDatabase.ref(
      database,
      `rooms/${inputRoomCode.current?.value}`
    );

    //Buscando por informações da sala capturada anteriormente.
    const getRoom = await firebaseDatabase.get(roomRef);

    //Verificando se a mesma existe
    if (!getRoom.exists()) {
      alert("Room does not exists");
      return;
    }

    if (getRoom.val().endedAt) {
      alert("Room already closed.");
      return;
    }

    navigate(`rooms/${getRoom.key}`);
  }
  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Cria salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Logo do Google" />
          <button
            type="button"
            className="create-room"
            onClick={handleCreateRoom}
          >
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              ref={inputRoomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
