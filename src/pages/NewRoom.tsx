import { FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "components/Button";
import illustrationImg from "assets/images/illustration.svg";
import logoImg from "assets/images/logo.svg";

import { database } from "services/firebase";

import * as firebaseDatabase from "firebase/database";

import { useAuth } from "hooks/useAuth";

import "styles/auth.scss";

export function NewRoom() {
  const inputRoom = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //Se após retirar os espaços laterais o valor que estiver no campo for vazio.
    if (inputRoom.current?.value.trim() === "") {
      return;
    }

    //Criando uma referência no banco de dados, caso a mesma não exista.
    const roomRef = firebaseDatabase.ref(database, "rooms");

    //Criando uma informação dentro de uma referência
    const firebaseRoom = await firebaseDatabase.push(roomRef, {
      title: inputRoom.current?.value,
      authorId: user?.id,
    });

    navigate(`/admin/rooms/${firebaseRoom.key}`);
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

          <h2>Criar um nova Sala</h2>

          <form onSubmit={handleCreateRoom}>
            <input type="text" placeholder="Nome da sala" ref={inputRoom} />
            <Button type="submit">Criar sala</Button>
          </form>

          <p>
            Quer entrar em uma sala existente?
            <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
