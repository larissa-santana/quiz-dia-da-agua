import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import Webcam from 'react-webcam';
import './App.css';

const questions = [
    { question: 'Qual é a porcentagem de água doce na Terra?', options: ['2.5%', '10%', '25%', '70%'], answer: 0 },
    { question: 'Qual o maior rio do mundo em volume de água?', options: ['Amazonas', 'Nilo', 'Yangtzé', 'Mississipi'], answer: 0 },
    { question: 'Qual é o país com maior consumo de água per capita?', options: ['Brasil', 'EUA', 'China', 'Índia'], answer: 1 },
    { question: 'Qual é a principal causa de desperdício de água em residências?', options: ['Vazamentos', 'Banhos longos', 'Lavar carros', 'Regar jardins'], answer: 0 }
];

function App() {
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [quizStarted, setQuizStarted] = useState(false);
    const [ranking, setRanking] = useState([]);
    const webcamRef = React.useRef(null);

    useEffect(() => {
        if (quizStarted && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [quizStarted, timeLeft]);

    const startQuiz = () => {
        setScore(0);
        setTimeLeft(30);
        setQuestionIndex(0);
        setQuizStarted(true);
        capturePhoto();
    };

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPhoto(imageSrc);
    };

    const checkAnswer = (index) => {
        if (index === questions[questionIndex].answer) {
            setScore(score + 1);
        }
        nextQuestion();
    };

    const nextQuestion = () => {
        if (questionIndex < 9) {
            setQuestionIndex(questionIndex + 1);
            setTimeLeft(30);
        } else {
            endQuiz();
        }
    };

    const endQuiz = () => {
        setQuizStarted(false);
        setRanking([...ranking, { name, score, photo }]);
    };

    return (
        <div className="app bg-green-800 text-white min-h-screen flex flex-col items-center justify-center">
            {!quizStarted ? (
                <div className="start-screen text-center">
                    <h1 className="text-4xl font-bold">Quiz - Dia da Água</h1>
                    <input className="p-2 rounded" placeholder="Digite seu nome" value={name} onChange={(e) => setName(e.target.value)} />
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="my-4 rounded-lg" />
                    <Button onClick={startQuiz} className="bg-green-600">Iniciar Quiz</Button>
                </div>
            ) : (
                <Card className="quiz-card p-4 m-4">
                    <CardContent>
                        <h2 className="text-2xl mb-4">{questions[questionIndex].question}</h2>
                        <p>Tempo restante: {timeLeft}s</p>
                        {questions[questionIndex].options.map((option, idx) => (
                            <Button key={idx} onClick={() => checkAnswer(idx)} className="my-2 bg-green-500 w-full">{option}</Button>
                        ))}
                        <p>Pontuação: {score}</p>
                    </CardContent>
                </Card>
            )}
            <div className="ranking mt-4">
                <h2 className="text-2xl">Ranking</h2>
                {ranking.map((entry, idx) => (
                    <div key={idx} className="ranking-item flex items-center">
                        {entry.photo && <img src={entry.photo} alt="Jogador" className="w-12 h-12 rounded-full mr-2" />}
                        <p>{entry.name} - {entry.score} pontos</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;