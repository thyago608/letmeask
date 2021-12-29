import illustrationImg from "assets/images/illustration.svg";
import logoImg from "assets/images/logo.svg";
import googleIconImg from "assets/images/google-icon.svg";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { auth } from "services/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import "styles/auth.scss";

export function Home() {
  const navigate = useNavigate();

  function handleCreateRoom() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider).then((result) => console.log(result));

    // navigate("new");
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

          <form action="">
            <input type="text" placeholder="Digite o código da sala" />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
