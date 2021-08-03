import { useHistory, useParams } from "react-router-dom";

// import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import logoImg from "../assets/images/logo.svg";
import "../styles/room.scss";

interface RoomParams {
  id: string;
}

const AdminRoom = () => {
  // const { user } = useAuth();
  const history = useHistory();
  const { id } = useParams<RoomParams>();
  const { questions, title } = useRoom(id);

  const handleEndRoom = async () => {
    await database.ref(`rooms/${id}`).update({ closedAt: new Date() });

    history.push("/");
  };

  const handleCheckQuestion = async (questionId: string) => {
    await database
      .ref(`rooms/${id}/questions/${questionId}`)
      .update({ isAnswered: true });
  };

  const handleHighlightQuestion = async (questionId: string) => {
    await database
      .ref(`rooms/${id}/questions/${questionId}`)
      .update({ isHighlighted: true });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Você tem certeza que deseja excluir essa pergunta ?")) {
      await database.ref(`rooms/${id}/questions/${questionId}`).remove();
    }
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={id} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 ? (
            <span>{questions.length} pergunta(s)</span>
          ) : (
            <span>Nenhuma pergunta até agora :/</span>
          )}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type="submit"
                    onClick={() => handleCheckQuestion(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                  <button
                    type="submit"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                  </button>
                </>
              )}
              <button
                type="submit"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
};

export { AdminRoom };
